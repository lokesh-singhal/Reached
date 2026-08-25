"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar/Navbar";
import Footer from "./Footer";
import { Toaster } from "./ui/sonner";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isHost = pathname.startsWith("/host");
  const hideNavbar =  pathname.startsWith("/host") ||
                      pathname.startsWith("/sign-in") ||
                      pathname.startsWith("/sign-up");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <main className="flex-1">
        <Toaster />
        {children}
      </main>

      {!isHost && <Footer />}
    </>
  );
}