export interface CreditPackage {
  id: string;
  label: string;
  credits: number;
  price: number;
  priceLabel: string;
  badge?: string;
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  { id: "pack-1", label: "5 Credits", credits: 5, price: 100, priceLabel: "$1" },
  { id: "pack-3", label: "20 Credits", credits: 20, price: 300, priceLabel: "$3", badge: "Save 25%" },
  { id: "pack-5", label: "40 Credits", credits: 40, price: 500, priceLabel: "$5", badge: "Save 37%" },
  { id: "pack-10", label: "100 Credits", credits: 100, price: 1000, priceLabel: "$10", badge: "Best Value" },
];

export type PackageId = (typeof CREDIT_PACKAGES)[number]["id"];

export function getPackageById(id: string) {
  return CREDIT_PACKAGES.find((p) => p.id === id);
}

export const FREE_CREDITS_ON_SIGNUP = 3;
