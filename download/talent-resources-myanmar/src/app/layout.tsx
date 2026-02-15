import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Talent Resources Myanmar - Recruitment Agency Platform",
  description: "Myanmar's leading recruitment agency management platform. CRM, ATS, and AI-powered candidate matching for modern agencies.",
  keywords: ["Myanmar", "Recruitment", "HR", "CRM", "ATS", "Staffing", "Talent"],
  authors: [{ name: "Talent Resources Myanmar" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-slate-50 text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
