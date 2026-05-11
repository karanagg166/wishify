import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { TemplateProvider } from "@/context/TemplateContext";
import { PremiumProvider } from "@/context/PremiumContext";
import { APP_NAME, APP_DESCRIPTION } from "@/constants/config";
import { PremiumPopup } from "@/components/features/premium/PremiumPopup";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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
    <html lang="en" className={inter.variable}>
      <body className="bg-white text-gray-900 antialiased">
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
