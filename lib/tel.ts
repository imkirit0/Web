// Bare 10-digit numbers on the live site are Indian; longer ones already carry a country code, minus the "+".
export const tel = (p: string, country: string) => {
  const d = p.replace(/[^\d+]/g, "");
  return `tel:${d.startsWith("+") ? d : country === "India" && d.length === 10 ? `+91${d}` : d.length > 10 ? `+${d}` : d}`;
};
