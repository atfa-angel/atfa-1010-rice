export const PACK_WEIGHT_KG = 1.5;
export const PACKS_PER_BOX = 12;
export const BOX_WEIGHT_KG = 18;
export const PACK_PRICE = 10.1;
export const BOX_PRICE = 121.2;

export function computeAmount(boxes: number): number {
  return Math.round(boxes * BOX_PRICE * 100) / 100;
}

export function formatAmount(amount: number): string {
  return amount.toLocaleString("en-AU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
