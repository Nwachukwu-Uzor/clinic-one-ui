"use client";
import { Button } from "@/components/ui/button";
import { GiHospitalCross } from "react-icons/gi";
import { FaCircleUser } from "react-icons/fa6";
import { BiSolidDashboard } from "react-icons/bi";
import React, { useState } from "react";
import Link from "next/link";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navLinks = [
    {
      id: 1,
      content: (
        <>
          <BiSolidDashboard /> Dashboard
        </>
      ),
      to: "/dashboard",
    },
    {
      id: 2,
      content: (
        <>
          <FaCircleUser /> Profile
        </>
      ),
      to: "/profile",
    },
  ];
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
            <div className="h-12 w-12 flex items-center justify-center mx-auto my-3 bg-white rounded-full">
              <GiHospitalCross className="text-4xl text-purple-800" />
            </div>
            {/* <button onClick={toggleSidebarOpen}>Close</button> */}
            <ul className="flex flex-col gap-2 mt-6">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.to}
                    className="flex items-center gap-1 px-2 py-1 font-semibold"
                  >
                    {link.content}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="h-[10vh] mt-auto py-1 border-t border-t-gray-300">
            <Button>Logout</Button>
          </div>
        </div>
      </aside>
      <section className="border flex-1 bg-gray-100 h-screen overflow-auto">
        <header className="bg-white h-12 flex items-center px-2 shadow-sm border-b-[0.5px]">
          <div>
            Header <button onClick={toggleSidebarOpen}>Open</button>
          </div>
        </header>
        <section className="p-2">{children}</section>
      </section>
    </main>
  );
};

export default Layout;
