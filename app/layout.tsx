import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const font = Poppins({
  weight : ["400", "500", "600", "700"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Auth",
  description: "a toolkit for building auth pages in my next.js projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={cn(font.className,"antialiased")}>{children}</body>
    </html>
  );
}
