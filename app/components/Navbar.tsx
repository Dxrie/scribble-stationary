import React from "react";
import Search from "@mui/icons-material/Search";

const Navbar = () => {
  return (
    <div className="w-full h-[100vh] bg-[#264653] text-white">
      <div className="flex items-center w-full bg-[#2A9D8F] py-3 px-3 text-black">
        <div className="w-[60%]">
          <div className="inline relative bg-black">
            <input
              type="text"
              className="rounded-md py-2 px-2 focus:outline-none"
              placeholder="Alat tulis populer"
              id="search"
            />
          </div>
        </div>
        <div className="w-[40%]">asdas</div>
      </div>
    </div>
  );
};

export default Navbar;
