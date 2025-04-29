import React from "react";
import { RiRobot2Line } from "react-icons/ri";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="flex justify-between py-4 px-6 shadow-md bg-sky-700 border border-b-amber-400">
      {/* Logo */}
      <div className="flex items-center text-black">
        <div className="px-2 text-2xl font-bold">
          <RiRobot2Line />
        </div>
        <h1 className="uppercase italic text-2xl font-bold">Buddy Career</h1>
      </div>
      {/* Link */}
      <div className="text-black text-lg font-stretch-100%">
        <Link href="/careerbuddy">Career Solution</Link>
      </div>
    </div>
  );
};

export default Navbar;
