import type { ReactNode } from "react";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "var(--font-display)" }}
    >
      <Navbar />

      <main className="flex-1 w-full pb-32 md:pb-20">
        {children}
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
