import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Quicksand } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/app/utils/ReactQueryProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { UserContextProvider } from "@/app/context/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Scribble - Home Page",
  description: "Scribble is a stationary e-commerce website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${quicksand.variable} ${poppins.variable} antialiased`}
      >
        <UserContextProvider>
          <ReactQueryProvider>
            <main>{children}</main>
            <Analytics />
            <SpeedInsights />
          </ReactQueryProvider>
        </UserContextProvider>
      </body>
    </html>
  );
}
