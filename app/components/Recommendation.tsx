"use server";
import React from "react";
import Product from "./Product";
// import {x} from "../lib/libs";

const Recommendation = () => {
  return (
    <>
      <div className="flex flex-col w-full font-poppins text-black gap-3  px-5">
        <h1>Recommendations for you</h1>

        <Product />
      </div>
    </>
  );
};

export default Recommendation;
