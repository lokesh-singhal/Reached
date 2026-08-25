import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Script from "next/script";
import "leaflet/dist/leaflet.css";
import "react-day-picker/dist/style.css";
import { Toaster } from "../components/ui/sonner";
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth.api.getSession({headers: await headers()});
  if(!session){
    redirect("/sign-in");
  }
  
  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <SideBar />

      <main className="flex-1">
        <Toaster />
        {children}
      </main>
    </>
  );
}
