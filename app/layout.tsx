import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SILO - Smart Storage for Safer Harvests",
  description:
    "Web-based monitoring system for postharvest grain storage. Monitor temperature, humidity, VOC, CO2, and grain moisture in real time.",
  keywords: [
    "grain storage",
    "postharvest monitoring",
    "smart agriculture",
    "mold detection",
    "IoT dashboard",
    "ESP32",
    "warehouse monitoring",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
