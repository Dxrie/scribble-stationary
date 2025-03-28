import React from "react";
import {House, Search, Bell, User} from "lucide-react";
import Link from "next/link";

const Navbar = ({currentIndex}: {currentIndex: number}) => {
  return (
    <div className="w-full flex justify-center fixed bottom-4">
      <div className="rounded-full bg-primary font-poppins w-[93%] text-white flex justify-around shadow-xl py-4">
        <Link href={"/"}>
          <span className="flex flex-col items-center">
            <House className="text-[30px]" color={currentIndex === 0 ? "#E9C46A" : "white"} />
          </span>
        </Link>

        <Link href={"/"}>
          <span className="flex flex-col items-center">
            <Search className="text-[30px]" color={currentIndex === 1 ? "#E9C46A" : "white"} />
          </span>
        </Link>

        <Link href={"/"}>
          <span className="flex flex-col items-center">
            <Bell className="text-[30px]" color={currentIndex === 2 ? "#E9C46A" : "white"} />
          </span>
        </Link>

        <Link href={"/user"}>
          <span className="flex flex-col items-center">
            <User className="text-[30px]" color={currentIndex === 3 ? "#E9C46A" : "white"} />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
