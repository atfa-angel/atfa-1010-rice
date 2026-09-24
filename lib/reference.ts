export function formatReference(id: number): string {
  return `ATFA1010-${String(id).padStart(4, "0")}`;
}
