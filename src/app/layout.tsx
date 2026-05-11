import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { TemplateProvider } from "@/context/TemplateContext";
import { PremiumProvider } from "@/context/PremiumContext";
import { APP_NAME, APP_DESCRIPTION } from "@/constants/config";
import { PremiumPopup } from "@/components/features/premium/PremiumPopup";

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-white text-gray-900 antialiased">
        <AuthProvider>
          <TemplateProvider>
            <PremiumProvider>
              {children}
              <PremiumPopup />
            </PremiumProvider>
          </TemplateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
