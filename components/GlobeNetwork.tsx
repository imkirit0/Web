"use client";

import { useEffect, useRef, useState } from "react";
import { COUNTRIES, HQ } from "@/lib/data";

const IDLE = "Drag to rotate · hover a country";

/**
 * Interactive three.js Earth (ported from the G-TEC UK site): day map with city lights on the
 * night side, clouds, an atmosphere halo, and an arc from the Calicut head office to every
 * country. Hovering a country chip turns the globe to it. `intro` and `footer` sit either side
 * of the chips in the left column.
 */
export function GlobeNetwork({ intro, footer }: { intro: React.ReactNode; footer?: React.ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  const hover = useRef("");
  const [label, setLabel] = useState(IDLE);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dead = false;
    let cleanup = () => {};
    (async () => {
      const THREE = await import("three");
      if (dead) return;
      const W = el.clientWidth || 480;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(2, devicePixelRatio));
      renderer.setSize(W, W);
      Object.assign(renderer.domElement.style, { position: "absolute", inset: "0", width: "100%", height: "100%" });
      el.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const cam = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      cam.position.z = 3.1;
      const g = new THREE.Group();
      scene.add(g);
      g.rotation.x = 0.25;

      // Background stars (fixed, outside the globe group)
      const S = 1200;
      const sp = new Float32Array(S * 3);
      for (let i = 0; i < S; i++) {
        const v = new THREE.Vector3().randomDirection().multiplyScalar(20 + Math.random() * 20);
        sp.set([v.x, v.y, v.z], i * 3);
      }
      const sg = new THREE.BufferGeometry();
      sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
      scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.7 })));

      // Earth: day map, city lights on the night side, specular oceans
      const tl = new THREE.TextureLoader();
      const tex = (f: string) => {
        const t = tl.load(`/textures/${f}`);
        t.anisotropy = 8;
        return t;
      };
      const day = tex("earth_atmos_2048.jpg");
      day.colorSpace = THREE.SRGBColorSpace;
      const night = tex("earth_lights_2048.png");
      night.colorSpace = THREE.SRGBColorSpace;
      const sun = new THREE.Vector3(-1, 0.35, 0.9).normalize();
      const earth = new THREE.Mesh(
        new THREE.SphereGeometry(1, 96, 96),
        new THREE.ShaderMaterial({
          uniforms: { day: { value: day }, night: { value: night }, spec: { value: tex("earth_specular_2048.jpg") }, sun: { value: sun } },
          vertexShader: `varying vec2 vUv; varying vec3 vN; varying vec3 vV;
            void main(){ vUv=uv; vN=normalize(mat3(modelMatrix)*normal); vec4 w=modelMatrix*vec4(position,1.); vV=normalize(cameraPosition-w.xyz); gl_Position=projectionMatrix*viewMatrix*w; }`,
          fragmentShader: `uniform sampler2D day, night, spec; uniform vec3 sun; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
            void main(){
              float l=dot(vN,sun), mixv=smoothstep(-0.15,0.25,l);
              vec3 d=texture2D(day,vUv).rgb*(0.35+1.1*max(l,0.)), n=texture2D(night,vUv).rgb*vec3(1.,.8,.55)*1.6;
              float s=texture2D(spec,vUv).r*pow(max(dot(reflect(-sun,vN),vV),0.),40.)*0.35;
              vec3 c=mix(n+d*0.08,d+s,mixv);
              float rim=pow(1.-max(dot(vN,vV),0.),3.); c+=vec3(.3,.55,1.)*rim*0.55*(0.3+mixv);
              gl_FragColor=vec4(c,1.);
              #include <colorspace_fragment>
            }`,
        }),
      );
      g.add(earth);
      const clouds = new THREE.Mesh(
        new THREE.SphereGeometry(1.012, 64, 64),
        new THREE.MeshLambertMaterial({ map: tex("earth_clouds_1024.png"), transparent: true, opacity: 0.8, depthWrite: false }),
      );
      g.add(clouds);
      scene.add(new THREE.DirectionalLight(0xffffff, 2.2).translateOnAxis(sun, 5), new THREE.AmbientLight(0x6688cc, 0.15));
      // Atmosphere halo (back faces, additive fresnel)
      scene.add(
        new THREE.Mesh(
          new THREE.SphereGeometry(1.14, 64, 64),
          new THREE.ShaderMaterial({
            side: THREE.BackSide,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            vertexShader: `varying vec3 vN; varying vec3 vV; void main(){ vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }`,
            fragmentShader: `varying vec3 vN; varying vec3 vV; void main(){ float i=pow(clamp(0.72+dot(vN,vV),0.,1.),4.); gl_FragColor=vec4(.35,.62,1.,1.)*i*1.4; }`,
          }),
        ),
      );

      const toVec = (lat: number, lon: number, r = 1.02) => {
        const phi = ((90 - lat) * Math.PI) / 180;
        const th = ((lon + 180) * Math.PI) / 180;
        return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
      };
      const facing = (lat: number, lon: number) => {
        const th = ((lon + 180) * Math.PI) / 180;
        return { ry: -Math.atan2(-Math.cos(th), Math.sin(th)), rx: ((lat * Math.PI) / 180) * 0.6 };
      };
      type Marker = { m: InstanceType<typeof THREE.Mesh>; line?: InstanceType<typeof THREE.Line>; ry: number; rx: number };
      const markers: Record<string, Marker> = {};

      // Head office: a bigger coral dot with a pulsing ring
      const [hLat, hLon] = HQ;
      const hq = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff7a59 }));
      hq.position.copy(toVec(hLat, hLon));
      g.add(hq);
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.05, 0.06, 32),
        new THREE.MeshBasicMaterial({ color: 0xff7a59, transparent: true, opacity: 0.8, side: THREE.DoubleSide }),
      );
      ring.position.copy(toVec(hLat, hLon, 1.025));
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      g.add(ring);

      const mGeo = new THREE.SphereGeometry(0.02, 12, 12);
      for (const { name, coords } of COUNTRIES) {
        const [lat, lon] = coords;
        if (name === "India") {
          markers[name] = { m: hq, ...facing(lat, lon) };
          continue;
        }
        const m = new THREE.Mesh(mGeo, new THREE.MeshBasicMaterial({ color: 0xe0201c }));
        m.position.copy(toVec(lat, lon));
        g.add(m);
        const curve = new THREE.QuadraticBezierCurve3(toVec(hLat, hLon), toVec((hLat + lat) / 2, (hLon + lon) / 2, 1.35), toVec(lat, lon));
        const line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(curve.getPoints(40)),
          new THREE.LineBasicMaterial({ color: 0xffb08a, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }),
        );
        g.add(line);
        markers[name] = { m, line, ...facing(lat, lon) };
      }
      g.rotation.y = markers.India.ry - 0.5; // open on the Indian Ocean, drifting east

      let drag = false;
      let lx = 0;
      let vel = 0;
      let ly = 0;
      const down = (e: PointerEvent) => {
        drag = true;
        lx = e.clientX;
        ly = e.clientY;
        el.style.cursor = "grabbing";
        hover.current = "";
      };
      const up = () => {
        drag = false;
        el.style.cursor = "grab";
      };
      const move = (e: PointerEvent) => {
        if (!drag) return;
        const dx = e.clientX - lx;
        const dy = e.clientY - ly;
        lx = e.clientX;
        ly = e.clientY;
        g.rotation.y += dx * 0.006;
        g.rotation.x = Math.max(-1, Math.min(1, g.rotation.x + dy * 0.004));
        vel = dx * 0.006;
      };
      el.addEventListener("pointerdown", down);
      addEventListener("pointerup", up);
      addEventListener("pointercancel", up); // a vertical swipe hands the gesture to page scroll
      el.addEventListener("pointermove", move);
      const ro = new ResizeObserver(() => {
        const w = el.clientWidth;
        renderer.setSize(w, w);
      });
      ro.observe(el);

      let raf = 0;
      const loop = () => {
        raf = requestAnimationFrame(loop);
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return; // off-screen: skip the render
        const tgt = hover.current ? markers[hover.current] : undefined;
        if (tgt && !drag) {
          let d = tgt.ry - g.rotation.y;
          d = Math.atan2(Math.sin(d), Math.cos(d));
          g.rotation.y += d * 0.08;
          g.rotation.x += (tgt.rx - g.rotation.x) * 0.08;
        } else if (!drag && !reduce) {
          g.rotation.y += 0.0022 + vel;
          vel *= 0.94;
        }
        for (const k in markers) {
          const mk = markers[k];
          const hot = k === hover.current;
          if (mk.m !== hq) mk.m.scale.setScalar(hot ? 2.2 : 1);
          if (mk.line) (mk.line.material as InstanceType<typeof THREE.LineBasicMaterial>).opacity = hot ? 1 : 0.35;
        }
        if (!reduce) clouds.rotation.y += 0.0004;
        ring.scale.setScalar(1 + 0.25 * Math.sin(performance.now() / 400));
        renderer.render(scene, cam);
      };
      loop();
      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        el.removeEventListener("pointerdown", down);
        removeEventListener("pointerup", up);
        removeEventListener("pointercancel", up);
        el.removeEventListener("pointermove", move);
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();
    return () => {
      dead = true;
      cleanup();
    };
  }, []);

  return (
    <>
      <div>
        {intro}
        <div
          className="mb-10 flex flex-wrap gap-2"
          onMouseLeave={() => {
            hover.current = "";
            setLabel(IDLE);
          }}
        >
          {COUNTRIES.map((c) => (
            <a
              key={c.name}
              href={c.url}
              onMouseEnter={() => {
                hover.current = c.name;
                setLabel(c.name === "India" ? "Head office · Calicut, India" : `Calicut → ${c.name}`);
              }}
              onFocus={() => {
                hover.current = c.name;
                setLabel(c.name === "India" ? "Head office · Calicut, India" : `Calicut → ${c.name}`);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 py-1.5 pr-3.5 pl-1.5 text-[13px] font-semibold backdrop-blur-md transition duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-coral hover:bg-red/12"
            >
              <img src={c.flag} alt="" loading="lazy" className="block h-4 w-6 rounded object-cover" />
              {c.name}
            </a>
          ))}
        </div>
        {footer}
      </div>
      <div ref={host} role="img" aria-label="Interactive globe of G-TEC countries" className="relative mx-auto aspect-square w-full max-w-[580px] cursor-grab touch-pan-y">
        <div className="pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(72,120,255,.35),transparent_70%)] blur-[30px]" />
        <div aria-live="polite" className="pointer-events-none absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap text-white/55">
          {label}
        </div>
      </div>
    </>
  );
}
