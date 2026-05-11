import type { Template } from "./template";

export interface Share {
  id: string;
  userId: string;
  templateId: string;
  sharedAt: Date;
  template?: Template;
}

export interface CreateSharePayload {
  templateId: string;
}
