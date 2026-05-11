export type Provider = "GOOGLE" | "EMAIL" | "GUEST";

export type SubscriptionStatus = "FREE" | "PREMIUM" | "EXPIRED";

export interface AppUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  provider: Provider;
  subscription: SubscriptionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppSession {
  user: AppUser;
  session: {
    id: string;
    expiresAt: Date;
    token: string;
  };
}
