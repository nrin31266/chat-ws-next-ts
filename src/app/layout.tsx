import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import 'bootstrap/dist/css/bootstrap.min.css';

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
