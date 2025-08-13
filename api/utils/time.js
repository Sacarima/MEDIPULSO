export const normalizeTime = (t) => {
  if (!t && t !== 0) return "";
  const [h, m] = String(t).trim().split(":");
  const hh = String(parseInt(h ?? "0", 10)).padStart(2, "0");
  const mm = String(parseInt(m ?? "0", 10)).padStart(2, "0");
  return `${hh}:${mm}`;
};
