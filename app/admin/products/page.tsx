"use client";

import AdminRoute from "@/app/components/AdminRoute";
import { IProduct } from "@/app/lib/models/product";
import getProducts from "@/app/utils/getProducts";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import UploadForm from "@/app/components/UploadForm";

export default function AdminProductsPage() {
  const [productImage, setProductImage] = useState<File | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  const { data: products, isFetching } = useQuery<IProduct[]>({
    queryKey: ["allProducts"],
    queryFn: getProducts,
    initialData: [],
    refetchOnWindowFocus: false,
  });
  const formSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    price: z.coerce.number().nonnegative(),
    stock: z.coerce.number().int().nonnegative(),
    image: z.string().url(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      image: "",
    },
  });

  useEffect(() => {
    form.reset({
      name: selectedProduct?.name,
      description: selectedProduct?.description,
      price: selectedProduct?.price,
      stock: selectedProduct?.stock,
    });
  }, [selectedProduct]);

  const editHandler = () => {

  };

  return (
    <AdminRoute>
      <div className="h-full w-[calc(100dvw-16rem)] flex flex-col px-6 gap-2 pt-5">
        <div>
          <h1 className="font-semibold text-4xl">Products</h1>
          <p className="text-xl">View all products from database</p>
        </div>

        {isFetching ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-lg">Loading products...</p>
          </div>
        ) : (
          <div className="flex gap-4 flex-wrap">
            {products.map((item) => (
              <div
                key={item._id}
                className="flex flex-col w-[calc(50%-1rem)] p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <h3 className="font-medium text-lg">{item.name}</h3>
                    <p className="text-gray-600 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="mt-auto flex justify-between">
                      <p className="font-semibold">
                        Rp {item.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Stock: {item.stock}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <Dialog
                    onOpenChange={(open) => {
                      setSelectedProduct(open ? item : null);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant={"secondary"}>Edit</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit the product</DialogTitle>
                        <DialogDescription className="text-foreground">
                          Update the product details below.
                        </DialogDescription>
                      </DialogHeader>

                      <Form {...form}>
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Product name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Product description"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="stock"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Stock</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <UploadForm setImage={setProductImage} />
                        <DialogFooter className="pt-2">
                          <Button onClick={editHandler} type="submit">Save Changes</Button>
                        </DialogFooter>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  <Button variant={"destructive"}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminRoute>
  );
}
