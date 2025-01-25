"use client";
import {showSwal} from "@/app/lib/libs";
import React, {useEffect, useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

interface Product {
  name: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  category: string;
  isAvailable: boolean;
}

const Product = () => {
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
                {/* Image Container */}
                <div className="w-[250px] h-[200px] overflow-hidden bg-gray-200 rounded-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
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

                {/* Buttons */}
                <div className="absolute bottom-4 left-0 w-full flex items-center justify-between px-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => setSelectedProduct(product)}
                        className="bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-950"
                      >
                        Add to cart
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="border-none">
                      <DialogHeader>
                        <DialogTitle>
                          Add {selectedProduct?.name} to Cart
                        </DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col gap-4">
                        <img
                          src={selectedProduct?.image}
                          alt={selectedProduct?.name}
                          draggable={false}
                          className="w-full object-cover rounded-lg border-2 border-black"
                        />
                        <DialogDescription>
                          {selectedProduct?.description}
                        </DialogDescription>
                        <div className="flex flex-col gap-5">
                          <div className="flex items-center gap-2"><label
                            htmlFor="quantity"
                            className="text-sm font-medium"
                          >
                            Quantity (Price: Rp {selectedProduct?.price}):
                          </label>
                          <Input
                            id="quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) =>
                              setQuantity(Number(e.target.value))
                            }
                            min={1}
                            max={selectedProduct?.stock}
                            className="w-20"
                          /></div>
                          <label>Stock: {selectedProduct?.stock}</label>
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogTrigger asChild>
                          <Button onClick={handleAddToCart}>Add to Cart</Button>
                        </DialogTrigger>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Product;
