"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { x } from "../lib/libs";
import Image from "next/image";

const Categories = () => {
  const [loading, setLoading] = useState(true);

  // Simulate a loading state for demonstration purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Simulated delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full flex flex-col items-center mt-2 mb-4 text-black font-poppins gap-2 px-5">
      <div className="w-full flex justify-between">
        <h1>Shop By Category</h1>
        <Link className="text-gray-400 font-semibold" href={"/categories"}>
          See all
        </Link>
      </div>

      <div className="flex w-full overflow-x-auto gap-5">
        {loading
          ? Array(5)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 items-center animate-pulse"
                >
                  {/* Circle Skeleton */}
                  <div className="p-8 bg-gray-500 rounded-full border-2 border-black"></div>
                  {/* Text Skeleton */}
                  <div className="h-3 w-12 bg-gray-500 rounded"></div>
                </div>
              ))
          : x.map((item, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 items-center cursor-pointer"
              >
                <div className="p-8 bg-gray-500 rounded-full relative overflow-hidden border-2 border-black">
                  <Image
                    src={"/categories/notebook.jpg"}
                    alt={"s"}
                    objectFit={"cover"}
                    layout={"fill"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    draggable={false}
                  />
                </div>
                <p className="text-center w-[6em] text-wrap text-[13px]">
                  {item}
                </p>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Categories;
