import { LogIn } from "lucide-react";
import Link from "next/link";
import React from "react";

const NotLoggedInHeader = () => {
  return (
    <div className="flex items-center justify-between font-poppins w-full py-4 px-5">
      <span className="flex h-full items-center gap-[6px]">
        <img src="favicon.ico" width={30} />
        <h1 className="text-xl font-semibold text-black">Scribble</h1>
      </span>

      <span className="flex items-center gap-2">
        <Link href={"/login"}>
          {/* <button className="bg-primary font-semibold text-white h-full py-1 w-[6em] rounded-lg hover:bg-gray-950 transition-colors">
            Login
          </button> */}
          <LogIn className="text-black" />
        </Link>
      </span>
    </div>
  );
};

export default NotLoggedInHeader;
