"use client";

import { useQuery } from "@tanstack/react-query";
import { IProduct } from "../lib/models/product";
import getProducts from "../utils/getProducts";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ProductList({ searchQuery }: { searchQuery: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const {
    data: products,
    error,
    isError,
    isFetching,
  } = useQuery<IProduct[]>({
    queryFn: getProducts,
    queryKey: ["products"],
    initialData: [],
    retry: false,
    refetchOnWindowFocus: false,
  });

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase().trim();
    return products?.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query),
    );
  }, [products, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(
    (filteredProducts?.length || 0) / productsPerPage,
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts?.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (isFetching)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] p-5">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p>Loading products...</p>
      </div>
    );

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] p-5">
        <p className="text-red-600 text-center mb-4">Error: {error.message}</p>
      </div>
    );

  if (filteredProducts?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] p-5">
        <p className="text-gray-600 text-center mb-4">
          No products found matching {'"'}
          {searchQuery}
          {'"'}
        </p>
      </div>
    );
  }

  return (
    <div className="p-3 flex flex-col gap-4 mb-[70px]">
      {searchQuery && (
        <p className="text-sm text-gray-600">
          Showing {filteredProducts?.length} results for {'"'}
          {searchQuery}
          {'"'}
        </p>
      )}
      {currentProducts?.map((product) => (
        <div
          key={product._id}
          className="bg-white rounded-xl p-4 shadow-md relative border"
        >
          {product.image && (
            <div className="mb-3">
              <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={200}
                className="rounded-lg object-cover w-full"
                priority
              />
            </div>
          )}
          <h3 className="text-lg font-semibold m-0 mb-2">{product.name}</h3>
          <p className="text-sm text-gray-600 m-0 mb-3 leading-relaxed line-clamp-2">
            {product.description}
          </p>
          <p className="text-base font-semibold text-destructive m-0 mb-4">
            Rp {product.price.toLocaleString()}
          </p>
          <div className="flex gap-3">
            <Button>Add to Cart</Button>
            <Button variant={"secondary"}>View Product</Button>
          </div>
        </div>
      ))}
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Pagination className="mt-6 pb-20">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  paginate(currentPage - 1);
                }}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {(() => {
              let startPage = Math.max(1, currentPage - 1);
              const endPage = Math.min(totalPages, startPage + 2);

              if (endPage - startPage < 2) {
                startPage = Math.max(1, endPage - 2);
              }

              const paginationItems = [];
              for (let i = startPage; i <= endPage; i++) {
                paginationItems.push(
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        paginate(i);
                      }}
                      isActive={i === currentPage}
                    >
                      {i}
                    </PaginationLink>
                  </PaginationItem>,
                );
              }

              return paginationItems;
            })()}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  paginate(currentPage + 1);
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
