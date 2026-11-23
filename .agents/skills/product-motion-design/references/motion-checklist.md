# Motion Checklist

## Before implementation

- Name the user or product signal motion communicates.
- Inventory the existing animation stack and avoid duplicate runtimes.
- Define reduced-motion, keyboard, touch, and low-power behavior.
- Reserve stable dimensions for animated regions and canvases.

## Runtime

- Scope selectors and timeline ownership to the component.
- Cancel animation frames, observers, listeners, and asynchronous callbacks.
- Kill GSAP timelines and ScrollTriggers through the framework cleanup path.
- Dispose Three.js geometry, materials, textures, controls, and renderer resources.
- Cap device pixel ratio and pause work when offscreen or hidden.

## Browser proof

- Test initial, interrupted, repeated, resized, and route-unmounted states.
- Inspect mobile and desktop pixels for blank scenes, clipping, overlap, and layout shift.
- Toggle reduced motion and both color themes.
- Confirm content and actions remain available if animation initialization fails.
