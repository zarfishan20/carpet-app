"use client";

import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Topbar from "@/components/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
    
}) {

    const role: "admin" | "fitter" = "admin"; // 👈 TEMP FIX (replace later with real auth)

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">

      {/* Topbar */}
      <Topbar />

      {/* Middle Section */}
      <div className="flex flex-1">

        {/* Sidebar */}
        <Sidebar role={role} />

        {/* Page Content */}
        <main className="flex-1 p-4">
          {children}
        </main>

      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}