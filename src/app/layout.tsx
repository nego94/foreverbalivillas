import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CustomCursor from "@/components/CustomCursor";
import ScrollReveal from "@/components/ScrollReveal";
import CookieConsent from "@/components/CookieConsent";
import SiteOnlyShell from "@/components/SiteOnlyShell";
import ScriptInjector from "@/components/ScriptInjector";
import { getSettings } from "@/lib/admin-data";

export const metadata: Metadata = {
  title: {
    default: "Forever Bali Villas — Luxury Private Villas in Bali",
    template: "%s | Forever Bali Villas",
  },
  description:
    "Experience the art of slow living at Forever Bali Villas. Two exquisite private villas — Forever Santai and Forever Pandawa — nestled in the heart of Bali.",
  icons: {
    icon: [
      // Light mode
      { url: '/images/favicon/fbv-favicon-for-light-mode-16px.png', sizes: '16x16', type: 'image/png', media: '(prefers-color-scheme: light)' },
      { url: '/images/favicon/fbv-favicon-for-light-mode-32px.png', sizes: '32x32', type: 'image/png', media: '(prefers-color-scheme: light)' },
      // Dark mode
      { url: '/images/favicon/fbv-favicon-for-dark-mode-16px.png',  sizes: '16x16', type: 'image/png', media: '(prefers-color-scheme: dark)' },
      { url: '/images/favicon/fbv-favicon-for-dark-mode-32px.png',  sizes: '32x32', type: 'image/png', media: '(prefers-color-scheme: dark)' },
    ],
  },
  keywords: [
    "Bali villas",
    "luxury villa Bali",
    "private villa Bali",
    "Forever Santai",
    "Forever Pandawa",
    "Nusa Dua villa",
    "Bali accommodation",
  ],
  authors: [{ name: "Forever Bali Villas" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Forever Bali Villas",
    title: "Forever Bali Villas — Luxury Private Villas in Bali",
    description:
      "Experience the art of slow living at Forever Bali Villas. Two exquisite private villas in the heart of Bali.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Forever Bali Villas",
    description: "Luxury private villas in Bali — where tradition meets modern luxury.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const { scripts, contact, social, booking } = settings;

  return (
    <html lang="en">
      <body>
        {/* Inject custom tracking scripts (GA, Meta Pixel, etc.) set in admin Settings */}
        {(scripts?.head || scripts?.body) && (
          <ScriptInjector headHtml={scripts.head} bodyHtml={scripts.body} />
        )}
        <Header contact={contact} social={social} booking={booking} />
        <main>{children}</main>
        <SiteOnlyShell>
          <Footer contact={contact} social={social} />
          <CustomCursor />
          <WhatsAppButton waNumber={contact.whatsapp} />
          <ScrollReveal />
          <CookieConsent />
        </SiteOnlyShell>
      </body>
    </html>
  );
}
