import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vocaly AI demo agent",
  description: "Process your phone calls with Vocaly AI",
  openGraph: {
    title: "Vocaly AI demo agent",
    description: "Process your phone calls with Vocaly AI",
    images: [
      {
        url: "/images/preview.png",
        width: 1200,
        height: 630,
        alt: "Try Vocaly AI demo agent to automate calls",
      },
    ],
    url: "https://vocalyai.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vocaly AI demo agent",
    description: "Process your phone calls with Vocaly AI",
    images: ["/images/preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
