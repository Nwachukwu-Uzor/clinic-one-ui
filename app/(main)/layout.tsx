"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebarOpen = () => {
    setSidebarOpen((opened) => !opened);
  };

  return (
    <main className="flex relative">
      <aside
        className={`fixed ${
          sidebarOpen ? "left-0 right-2" : "right-[100vw]"
        } lg:static duration-200`}
      >
        <div
          className={`w-full lg:w-[18vw] bg-purple-800 text-white h-screen flex flex-col`}
        >
          <nav className="h-[90vh] py-1 overflow-auto">
            <button onClick={toggleSidebarOpen}>Close</button>
            <h1>Sidebar</h1>
          </nav>
          <div className="h-[10vh] mt-auto py-1 border-t border-t-gray-300">
            <Button>Logout</Button>
          </div>
        </div>
      </aside>
      <section className="border flex-1 bg-gray-100 min-h-screen">
        <header className="bg-white h-12 flex items-center px-2 shadow-sm border-b-[0.5px]">
          <div>
            Header <button onClick={toggleSidebarOpen}>Open</button>
          </div>
        </header>
        <section>{children}</section>
      </section>
    </main>
  );
};

export default Layout;
