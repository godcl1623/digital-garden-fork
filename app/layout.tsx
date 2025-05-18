import { ReactNode } from "react";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import PlausibleProvider from "next-plausible";
import "../styles/global.css";
import "../styles/style.css";
import "../styles/prism.css";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Next.js",
};

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className={openSans.className}>
    <body>
    <PlausibleProvider domain={"mindstone.tuancao.me"}>
      <main className={"theme-light"}>
        {children}
      </main>
    </PlausibleProvider>
    </body>
    </html>
  );
}