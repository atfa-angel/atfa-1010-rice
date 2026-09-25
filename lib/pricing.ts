export const PACK_WEIGHT_KG = 1.5;
export const PACKS_PER_BOX = 12;
export const BOX_WEIGHT_KG = 18;
export const PACK_PRICE = 10.1;
export const BOX_PRICE = 121.2;

const PACK_PRICE_CENTS = 1010;
const BOX_PRICE_CENTS = 12120;

export const PICKUP_NOTE = "我們將於後續與您聯繫，安排至 Chatswood 附近或其他地區取貨。";

export function computeAmount(boxes: number, packs: number): number {
  return (boxes * BOX_PRICE_CENTS + packs * PACK_PRICE_CENTS) / 100;
}

export function formatAmount(amount: number): string {
  return amount.toLocaleString("en-AU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatQuantity(boxes: number, packs: number): string {
  const parts: string[] = [];
  if (boxes > 0) parts.push(`${boxes} 箱`);
  if (packs > 0) parts.push(`${packs} 包`);
  return parts.join(" + ") || "0";
}

export function totalKg(boxes: number, packs: number): number {
  return boxes * BOX_WEIGHT_KG + packs * PACK_WEIGHT_KG;
}
