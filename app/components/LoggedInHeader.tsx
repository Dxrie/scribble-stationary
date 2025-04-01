import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import React from "react";

const LoggedInHeader = () => {
  return (
    <div className="flex items-center justify-between font-poppins w-full py-4 px-5">
      <span className="flex h-full items-center gap-[6px]">
        <img alt={"logo"} src="favicon.ico" width={30} />
        <h1 className="text-xl font-semibold text-black">Scribble</h1>
      </span>

      <span className="flex items-center gap-2">
        <Link href={"/cart"}>
          <ShoppingCart className="text-3xl text-black hover:cursor-pointer" />
        </Link>
      </span>
    </div>
  );
};

export default LoggedInHeader;
