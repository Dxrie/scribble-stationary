import Link from "next/link";
import React from "react";

const NotLoggedInHeader = () => {
  return (
    <div className="flex items-center justify-between font-poppins w-full p-4 px-5">
      <span className="flex h-full items-center gap-1">
        <img src="favicon.ico" width={30} />
        <h1 className="text-xl font-semibold text-white">Scribble</h1>
      </span>

      <span className="flex items-center gap-2">
        <Link href={"/login"}>
          <button className="bg-[#2A9D8F] font-semibold text-white h-full py-1 w-[6em] rounded-lg hover:bg-[#176057] transition-colors">
            Login
          </button>
        </Link>
      </span>
    </div>
  );
};

export default NotLoggedInHeader;
