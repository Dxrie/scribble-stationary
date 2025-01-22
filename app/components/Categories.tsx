import Link from "next/link";
import React from "react";

const Categories = () => {
  const x = [
    "Notebooks & Journals",
    "Pens & Pencils",
    "Art Supplies",
    "Office Supplies",
    "Paper Products",
    "Planners & Organizers",
    "Desk Accessories",
    "Markers & Highlighters",
    "Adhesives & Tapes",
    "Craft Supplies",
    "Other",
  ];

  return (
    <div className="w-full flex flex-col items-center mt-2 text-white font-poppins gap-2">
      <div className="w-full flex justify-between px-5">
        <h1>Shop By Category</h1>
        <Link className="text-gray-400 font-semibold" href={"/categories"}>
          See all
        </Link>
      </div>

      <div className="flex w-[92%] overflow-x-auto gap-5">
        {x.map((item, index) => (
          <div key={index} className="flex flex-col gap-2 items-center cursor-pointer">
            <div className="p-8 bg-gray-500 rounded-full"></div>
            <p className="text-center text-[13px]">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
