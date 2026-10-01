import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import { Providers } from "@/components/providers";
import { Header, Footer } from "@/components/layout";
import "./globals.css";
import "./brand.css";
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  title: {
    default: "Solid Connect — Building connections that hold weight",
    template: "%s | Solid Connect",
  },
  description:
    "Connect with talent, skilled makers, logistics, property, suppliers and business opportunities through Solid Connect.",
  openGraph: {
    title: "Solid Connect",
    description: "People. Businesses. Opportunities. Connected.",
    images: ["/images/hero.png"],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} ${outfit.variable}`}>
        <AppRouterCacheProvider>
          <Providers>
            <Header />
            <main id="main">{children}</main>
            <Footer />
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
