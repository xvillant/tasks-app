import { Outlet } from "react-router-dom";

import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="container flex-1 p-4 max-w-7xl mx-auto flex flex-col">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
