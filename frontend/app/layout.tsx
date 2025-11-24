import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yakındaki Tarihi Yerler",
  description: "Antalya civarindaki tarihi noktaları harita üzerinden keşfedin."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}

