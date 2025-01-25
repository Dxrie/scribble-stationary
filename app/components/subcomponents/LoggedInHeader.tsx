import {ShoppingCart} from "@mui/icons-material";
import Link from "next/link";
import React from "react";

const LoggedInHeader = () => {
  return (
    <div className="flex items-center justify-between font-poppins w-full py-4 px-5">
      <span className="flex h-full items-center gap-[6px]">
        <img src="favicon.ico" width={30} />
        <h1 className="text-xl font-semibold text-white">Scribble</h1>
      </span>

      <span className="flex items-center gap-2">
        <Link href={"/cart"}>
          <ShoppingCart
            htmlColor="white"
            className="text-3xl hover:cursor-pointer"
          />
        </Link>
      </span>
    </div>
  );
};

export default LoggedInHeader;
