import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "somoBloom Africa – Premier School Management Software",
  description:
    "The ultimate school management system built for Kenyan schools, featuring CBC and JSS compliance with dedicated portals for Admin, Teachers, Students, and Parents.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
