"use client"

import "./globals.css";

import { Inter } from "next/font/google";
import { useEffect } from "react";

export const revalidate = 0;
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "UNIV3 BOT UI",
  description: "shows uni v3 pos stats",
};

export default function RootLayout({ children }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(
          function(registration) {
            console.log('Service Worker registration successful with scope: ', registration.scope);
          },
          function(err) {
            console.log('Service Worker registration failed: ', err);
          }
        );
      });
    }
  }, []);
  
  return (
    <html lang="en">
      <head>
      <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
