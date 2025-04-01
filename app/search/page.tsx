"use client";
import { useState } from "react";
import Navbar from "../components/Navbar";
import ProductList from "../components/ProductList";
import SearchHeader from "../components/SearchHeader";
import Transition from "../components/Transition";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Transition>
      <div className="bg-background w-full h-[100vh] font-poppins">
        <SearchHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <ProductList searchQuery={searchQuery} />
        <Navbar currentIndex={1} />
      </div>
    </Transition>
  );
}
