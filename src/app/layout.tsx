import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import Script from "next/script";
import "leaflet/dist/leaflet.css";
import "react-day-picker/dist/style.css";
import { Toaster } from "./components/ui/sonner";
import Footer from "./components/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reached",
  description: "Your housing partner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
        />
        <Navbar />


        <main className="flex-1">
          <Toaster />
          {children}
        </main>
        

        <Footer />
      </body>
    </html>
  );
}
