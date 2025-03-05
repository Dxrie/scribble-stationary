import React from "react";
import { House, Search, Bell, User } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="w-full flex justify-center fixed bottom-4">
      <div className="rounded-full bg-primary font-poppins w-[93%] py-4 text-white flex justify-around shadow-xl">
        <Link href={"/"}>
          <span className="flex flex-col items-center">
            <House className="text-[30px]" />
          </span>
        </Link>

        <Link href={"/"}>
          <span className="flex flex-col items-center">
            <Search className="text-[30px]" />
          </span>
        </Link>

        <Link href={"/"}>
          <span className="flex flex-col items-center">
            <Bell className="text-[30px]" />
          </span>
        </Link>

        <Link href={"/user"}>
          <span className="flex flex-col items-center">
            <User className="text-[30px]" />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
