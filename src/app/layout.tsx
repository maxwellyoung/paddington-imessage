import "@/app/globals.css";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "iMessage with Paddington",
  description: "Chat with Paddington Bear in an iMessage-style interface",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Chat with Paddington",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="theme-color"
          content="#f2f2f7"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#000000"
          media="(prefers-color-scheme: dark)"
        />
      </head>
      <body className={cn("antialiased", inter.className)}>{children}</body>
    </html>
  );
}
