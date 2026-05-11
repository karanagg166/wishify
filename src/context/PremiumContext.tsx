"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Template } from "@/types";
import { useAuth } from "./AuthContext";

interface PremiumContextValue {
  isPopupOpen: boolean;
  blockedTemplate: Template | null;
  openPopup: (template: Template) => void;
  closePopup: () => void;
  isPremiumUser: () => boolean;
}

const PremiumContext = createContext<PremiumContextValue>({
  isPopupOpen: false,
  blockedTemplate: null,
  openPopup: () => {},
  closePopup: () => {},
  isPremiumUser: () => false,
});

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [blockedTemplate, setBlockedTemplate] = useState<Template | null>(null);
  const { user } = useAuth();

  const openPopup = useCallback((template: Template) => {
    setBlockedTemplate(template);
    setIsPopupOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    setIsPopupOpen(false);
    setBlockedTemplate(null);
  }, []);

  const isPremiumUser = useCallback(() => {
    return user?.subscription === "PREMIUM";
  }, [user]);

  return (
    <PremiumContext.Provider
      value={{ isPopupOpen, blockedTemplate, openPopup, closePopup, isPremiumUser }}
    >
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  return useContext(PremiumContext);
}
