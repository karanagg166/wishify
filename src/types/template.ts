export type Tier = "FREE" | "PREMIUM";

export interface OverlayConfig {
  nameX: number;
  nameY: number;
  nameAnchor?: "left" | "center" | "right";
  avatarX: number;
  avatarY: number;
  avatarSize: number;
  fontSize: number;
  textColor: string;
  fontFamily?: string;
}

export interface Category {
  id: string;
  slug: string;
  label: string;
  icon: string | null;
  sortOrder: number;
}

export interface Template {
  id: string;
  title: string;
  imageUrl: string;
  thumbUrl: string;
  tier: Tier;
  categoryId: string;
  category?: Category;
  overlayConfig: OverlayConfig;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
}
