export function formatTimeUntilReset(timeUntilReset: number | null): string {
  if (!timeUntilReset || timeUntilReset <= 0) return "";

  const hours = Math.floor(timeUntilReset / (1000 * 60 * 60));
  const minutes = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
