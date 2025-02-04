"use client";
import {formatToCurrency, showSwal} from "@/app/lib/libs";
import React, {useEffect, useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Add, Remove} from "@mui/icons-material";
import {useMediaQuery} from "@mui/material";
import Link from "next/link";
import Image from "next/image";

interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category:
    | "Notebooks & Journals"
    | "Pens & Pencils"
    | "Art Supplies"
    | "Office Supplies"
    | "Paper Products"
    | "Planners & Organizers"
    | "Desk Accessories"
    | "Markers & Highlighters"
    | "Adhesives & Tapes"
    | "Craft Supplies"
    | "Other";
  image: string;
  isAvailable?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const Product = () => {
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  const match = useMediaQuery("(min-width:1024px)");

  const handleAddToCart = () => {
    if (selectedProduct) {
      console.log(`Added ${quantity} of ${selectedProduct.name} to the cart.`);
    }
    setQuantity(1);
    setSelectedProduct(null);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products", {
          method: "GET",
        });

        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          showSwal(
            "Error",
            "An error occured when fetching products, please reload the page to see if the issue persists.",
            "error"
          );
        }
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {/* Product List */}
      <div className="flex w-full overflow-x-auto gap-5 scroll font-poppins">
        {loading
          ? Array(5)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="w-[250px] h-[350px] flex-none relative bg-gray-300 rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer animate-pulse"
                >
                  {/* Image Skeleton */}
                  <div className="w-[250px] h-[200px] bg-gray-200 rounded-lg"></div>

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
          : products.map((product, index) => (
              <div
                key={index}
                className="w-[250px] h-[350px] flex-none relative bg-gray-300 rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                {/* Link wraps the entire card if match is true */}
                {match ? (
                  <Link href={`/product?id=${product._id}`}>
                    <div>
                      {/* Image Container */}
                      <div className="w-[250px] h-[200px] overflow-hidden bg-gray-200 rounded-lg">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={300}
                          height={300}
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

                      {/* Buttons (inside the Link when match is true) */}
                      <div className="absolute bottom-4 left-0 w-full flex items-center justify-between px-4">
                        <Button className="bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-950">
                          Add to cart
                        </Button>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <>
                    {/* Link wraps only the clickable part of the card (excluding the button) when match is false */}
                    <Link href={`/product?id=${product._id}`}>
                      <div>
                        {/* Image Container */}
                        <div className="w-[250px] h-[200px] overflow-hidden bg-gray-200 rounded-lg">
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
                    </Link>

                    {/* Buttons (outside the Link when match is false) */}
                    <div className="absolute bottom-4 left-0 w-full flex items-center justify-between px-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => {
                              setSelectedProduct(product);
                              setQuantity(1);
                            }}
                            className="bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-950"
                          >
                            Add to cart
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="border-none overflow-scroll max-w-max max-h-screen scroll">
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
                                selectedProduct?.name
                                  ? selectedProduct?.name
                                  : ""
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
                                <p className="font-thin">
                                  {selectedProduct?.name}
                                </p>
                              </div>

                              <div className="flex gap-2 items-center mt-4">
                                <Button
                                  onClick={() =>
                                    setQuantity(
                                      quantity > 1 ? quantity - 1 : quantity
                                    )
                                  }
                                >
                                  <Remove className="font-bold" />
                                </Button>
                                <h1 className="font-bold">{quantity}</h1>
                                <Button
                                  onClick={() =>
                                    setQuantity(
                                      selectedProduct?.stock
                                        ? quantity < selectedProduct?.stock
                                          ? quantity + 1
                                          : quantity
                                        : quantity
                                    )
                                  }
                                >
                                  <Add />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <DialogFooter className="sm:justify-start">
                            <DialogTrigger asChild>
                              <Button onClick={handleAddToCart}>
                                Add to Cart
                              </Button>
                            </DialogTrigger>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </>
                )}
              </div>
            ))}
      </div>
    </div>
  );
};

export default Product;
