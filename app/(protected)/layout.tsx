import React from "react";
import Navbar from "./_components/navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}
const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="min-h-screen w-full py-7 flex flex-col gap-y-10 items-center justify-center bg-radialgradient">
        <Navbar />
      {children}
    </div>
  );
};

export default ProtectedLayout;
