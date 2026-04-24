// All prices are stored in halíře (CZK * 100).
export function formatCZK(halire: number): string {
  const czk = Math.round(halire / 100);
  return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(czk);
}

export function formatCZKNumber(halire: number): number {
  return Math.round(halire / 100);
}
