export const ROUTES = {
  LOGIN: "/login",
  HOME: "/home",
  CARD: (id: string) => `/card/${id}`,
} as const;

export const API_ROUTES = {
  TEMPLATES: "/api/templates",
  UPLOAD: "/api/upload",
  SHARES: "/api/shares",
  SUBSCRIPTION: "/api/subscription",
} as const;
