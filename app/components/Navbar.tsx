import React from "react";
import {
  HomeOutlined,
  Search,
  NotificationsOutlined,
  PersonOutlineRounded,
} from "@mui/icons-material";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="w-full flex justify-center fixed bottom-4">
      <div className="rounded-full bg-[#2A9D8F] font-poppins w-[93%] py-4 text-white flex justify-around shadow-xl">
        <Link href={"/"}>
          <span className="flex flex-col items-center">
            <HomeOutlined className="text-[30px]" />
          </span>
        </Link>

        <Link href={"/"}>
          <span className="flex flex-col items-center">
            <Search className="text-[30px]" />
          </span>
        </Link>

        <Link href={"/"}>
          <span className="flex flex-col items-center">
            <NotificationsOutlined className="text-[30px]" />
          </span>
        </Link>

        <Link href={"/settings"}>
          <span className="flex flex-col items-center">
            <PersonOutlineRounded className="text-[30px]" />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
