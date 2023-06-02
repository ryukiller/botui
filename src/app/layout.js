import "./globals.css";

import { Inter } from "next/font/google";

export const revalidate = 0;
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "UNIV3 BOT UI",
  description: "shows uni v3 pos stats",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-slate-600">
      <head>
      <link
          rel="manifest"
          href="/manifest.json"
      />
    </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
