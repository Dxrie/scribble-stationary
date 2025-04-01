"use client";
import { formatToCurrency, IProduct, showSwal } from "@/app/lib/libs";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Add, Remove } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { useMutation, useQuery } from "@tanstack/react-query";
import getProducts from "@/app/utils/getProducts";
import { ArrowUpRight } from "lucide-react";
import addToCart from "@/app/utils/addToCart";
import { UserContext } from "@/app/context/UserContext";

const Product = () => {
  const [quantity, setQuantity] = useState(1);
  const { data, error, isError, isFetching } = useQuery<IProduct[]>({
    queryFn: getProducts,
    queryKey: ["products"],
    initialData: [],
    retry: false,
    refetchOnWindowFocus: false,
  });
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const match = useMediaQuery("(min-width:1024px)");
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext must be used within a user context");
  }

  const { user } = userContext;

  const mutation = useMutation({
    mutationFn: (data: { productId: string; userId: string; total: number }) =>
      addToCart(data.productId, data.userId, data.total),
    onSuccess: (data) => {
      showSwal("Success", data.message, "success");
    },
    onError: (error) => {
      showSwal("Error", error.message, "error");
    },
  });

  const addToCartCallback = useCallback(() => {
    if (mutation.isPending) return;

    if (!(selectedProduct?._id && user?._id))
      return showSwal(
        "Error",
        "Please create an account or login before adding this item to cart.",
        "error",
      );

    const userId = user._id;

    mutation.mutate({
      productId: selectedProduct._id,
      userId,
      total: quantity >= 1 ? quantity : 1,
    });
  }, [mutation, selectedProduct, user?._id, quantity]);

  useEffect(() => {
    if (error instanceof Error) {
      showSwal("Error", error.message, "error");
    }
  }, [error]);

  return (
    <div>
      {/* Product List */}
      <div className="flex w-full overflow-x-auto gap-5 scroll font-poppins">
        {isFetching || isError
          ? Array(5)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="w-[250px] h-[350px] flex-none relative bg-gray-300 rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer animate-pulse border-gray-600 border-[0.02px] shadow-lg"
                >
                  {/* Image Skeleton */}
                  <div className="w-[250px] h-[200px] bg-gray-200 rounded-lg rounded-b-none"></div>

                  {/* Text Skeleton */}
                  <div className="px-3 py-2 flex flex-col justify-start flex-grow space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>

                  {/* Buttons Skeleton */}
                  <div className="absolute bottom-4 left-0 w-full flex items-center justify-between px-4">
                    <div className="h-6 bg-gray-200 rounded-lg w-20"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              ))
          : data?.map((product, index) => (
              <div
                key={index}
                className="w-[250px] h-[350px] flex-none relative bg-white rounded-2xl overflow-hidden flex flex-col justify-between border-gray-600 border-[0.02px] shadow-lg"
              >
                <div>
                  {/* Image Container */}
                  <div className="w-[250px] h-[200px] overflow-hidden bg-gray-100 rounded-lg rounded-b-none">
                    <Image
                      src={product.image}
                      alt={product.name}
                      height={300}
                      width={300}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>

                  {/* Product Name and Price */}
                  <div className="px-3 py-2 flex flex-col justify-start flex-grow">
                    <h1 className="font-semibold text-[15px] text-black">
                      {product.name}
                    </h1>
                    <h1 className="text-[13px] text-black line-clamp-1">
                      {product.description}
                    </h1>
                    <h1 className="text-[12px] text-gray-700">
                      {"Rp " + product.price}
                    </h1>
                  </div>
                </div>

                {/* Buttons (outside the Link when match is false) */}
                <div className="absolute bottom-4 left-0 w-full flex items-center justify-between px-4">
                  {!match ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => {
                            setSelectedProduct(product);
                            setQuantity(1);
                          }}
                          className="bg-primary text-white text-sm rounded-lg hover:bg-gray-950 transition-colors duration-150"
                        >
                          Add to cart
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="border-none overflow-scroll max-w-max max-h-screen scroll rounded-lg">
                        <DialogHeader>
                          <DialogTitle>
                            Add {selectedProduct?.name} to Cart
                          </DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col w-full">
                          <Image
                            src={
                              selectedProduct?.image
                                ? selectedProduct?.image
                                : ""
                            }
                            alt={
                              selectedProduct?.name ? selectedProduct?.name : ""
                            }
                            width={300}
                            height={300}
                            draggable={false}
                            className="w-full object-cover rounded-lg border-2 border-black"
                            loading="lazy"
                          />
                          <div className="w-full flex justify-between items-center py-3 gap-10">
                            <div className="flex flex-col">
                              <p className="text-2xl font-bold">
                                Rp{formatToCurrency(selectedProduct?.price)}
                              </p>
                              <p className="font-normal">
                                {selectedProduct?.name}
                              </p>
                            </div>

                            <div className="flex gap-2 items-center mt-4">
                              <Button
                                onClick={() =>
                                  setQuantity(
                                    quantity > 1 ? quantity - 1 : quantity,
                                  )
                                }
                              >
                                <Remove className="font-bold" />
                              </Button>
                              <h1 className="font-bold">{quantity}</h1>
                              <Button onClick={() => setQuantity(quantity + 1)}>
                                <Add />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <DialogFooter className="sm:justify-start">
                          <DialogTrigger asChild>
                            <Button onClick={addToCartCallback}>
                              Add to Cart
                            </Button>
                          </DialogTrigger>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Link href={`/products/?id=${product._id}`}>
                      <Button
                        onClick={() => {
                          setSelectedProduct(product);
                          setQuantity(1);
                        }}
                        className="bg-primary text-white text-sm rounded-lg hover:bg-gray-950 transition-colors duration-150"
                      >
                        Add to cart
                      </Button>
                    </Link>
                  )}
                  <Link href={`/products/?id=${product._id}`}>
                    <div className="bg-primary hover:bg-gray-950 p-2 rounded-full transition-colors duration-150">
                      <ArrowUpRight className={"text-white"} />
                    </div>
                  </Link>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Product;
