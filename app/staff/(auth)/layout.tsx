import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 min-h-screen">
      <div className="bg-purple-700 h-screen hidden md:block"></div>
      <div className="col-span-1 xl:col-span-2 flex flex-col justify-center items-center h-screen bg-gray-100">
        {children}
      </div>
    </section>
  );
};

export default Layout;
