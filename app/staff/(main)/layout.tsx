"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MdMenuOpen } from "react-icons/md";
import { GiHospitalCross } from "react-icons/gi";
import { FaCircleUser, FaUsers } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { BiSolidDashboard } from "react-icons/bi";
import { RiLogoutCircleLine } from "react-icons/ri";
import Link from "next/link";
import { useAuth } from "@/hooks";
import { ClipLoader } from "react-spinners";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, user } = useAuth("/staff/login");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  let navLinks = [
    {
      id: 1,
      content: (
        <>
          <BiSolidDashboard /> Dashboard
        </>
      ),
      to: "/staff/dashboard",
    },
    {
      id: 2,
      content: (
        <>
          <FaCircleUser /> Profile
        </>
      ),
      to: "/staff/profile",
    },
  ];

  if (user) {
    if (
      typeof user.role === "object" &&
      user.role.find((role) => role.toUpperCase() === "ADMIN")
    )
      navLinks.splice(1, 0, {
        id: 3,
        content: (
          <>
            <FaUsers /> All Staff
          </>
        ),
        to: "/staff/all-staff",
      });
  }

  const toggleSidebarOpen = () => {
    setSidebarOpen((opened) => !opened);
  };

  return isLoading ? (
    <div className="h-screen flex items-center justify-center">
      <ClipLoader color="#7e22ce" />
    </div>
  ) : (
    <main className="flex relative">
      <aside
        className={`fixed ${
          sidebarOpen ? "left-0 right-2" : "right-[100vw]"
        } lg:static duration-200 z-50`}
      >
        <div
          className={`w-full lg:w-[18vw] bg-purple-800 text-white h-screen flex flex-col`}
        >
          <IoMdClose
            className="text-white lg:hidden absolute right-2 top-2"
            onClick={toggleSidebarOpen}
          />
          <nav className="h-[90vh] py-1 overflow-auto">
            <div className="h-12 aspect-square flex items-center justify-center mx-auto my-3 bg-white rounded-full">
              <GiHospitalCross className="text-4xl text-purple-800" />
            </div>
            {/* <button onClick={toggleSidebarOpen}>Close</button> */}
            <ul className="flex flex-col gap-2 mt-8 lg:mt-12">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.to}
                    className="flex items-center gap-1 px-2 py-1 font-semibold"
                    onClick={toggleSidebarOpen}
                  >
                    {link.content}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="h-[10vh] mt-auto py-1 border-t border-t-gray-300">
            <Button className="flex items-center gap-1 px-2 py-1 font-semibold">
              <RiLogoutCircleLine /> Logout
            </Button>
          </div>
        </div>
      </aside>
      <section className="border flex-1 bg-gray-100 h-screen overflow-auto">
        <header className="bg-white h-12 flex items-center justify-between lg:justify-end px-2 shadow-sm border-b-[0.5px]">
          <div className="h-6 aspect-square flex items-center justify-center bg-purple-800 rounded-full">
            <GiHospitalCross className="text-lg text-white" />
          </div>
          <MdMenuOpen
            className="text-purple-800 text lg:hidden"
            onClick={toggleSidebarOpen}
          />
          {/* <div>
            Header <button >Open</button>
          </div> */}
        </header>
        <section className="p-2">{children}</section>
      </section>
    </main>
  );
};

export default Layout;
