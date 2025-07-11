import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Start Hub",
  description: "StartHub connect with anyone and build your startup",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
