import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ClinicFlow — Digital Medical Records Platform",
  description:
    "ClinicFlow is a modern digital patient management platform for small and medium clinics. Replace paper files with a beautiful, searchable, timeline-based system.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
