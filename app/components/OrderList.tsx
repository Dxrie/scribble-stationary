"use client";

import { useQuery } from "@tanstack/react-query";
import getOrders from "../utils/getOrders";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { ICheckout } from "../lib/models/checkout";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Custom date formatting function
const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  return `${month} ${day}, ${year} at ${hours}:${minutes} ${ampm}`;
};

export default function OrderList() {
  const userContext = useContext(UserContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProof, setSelectedProof] = useState("");

  if (!userContext) {
    throw new Error("UserContext must be used within a user context");
  }

  const { user } = userContext;

  const { data: orders = [] } = useQuery<ICheckout[]>({
    queryFn: () => getOrders(user?._id),
    queryKey: ["orders"],
    initialData: [],
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!user?._id,
  });

  const handleViewProof = (proofUrl: string) => {
    setSelectedProof(proofUrl);
    setOpenDialog(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {orders.length === 0 ? (
        <p className="text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.isProcessed
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.isProcessed ? "Processed" : "Pending"}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-2">Products</h3>
                <div className="space-y-3">
                  {order.products.map((product) => (
                    <div
                      key={product._id}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden relative flex-shrink-0">
                          {typeof product.product === "object" &&
                          product.product.image ? (
                            <Image
                              src={product.product.image}
                              alt={product.product.name || "Product image"}
                              fill
                              className="object-cover"
                              sizes="(max-width: 64px) 100vw, 64px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <span className="text-gray-400 text-xs">
                                No Image
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {typeof product.product === "object"
                              ? product.product.name
                              : `Product ID: ${product.product}`}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {typeof product.product === "object" &&
                              `Rp ${product.product.price?.toLocaleString("id-ID") || "Price not available"}`}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {typeof product.product === "object" &&
                              `Qty: ${product.total}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="font-medium">{order.address.fullName}</p>
                  <p>{order.address.streetAddress}</p>
                  <p>
                    {order.address.city}, {order.address.province}{" "}
                    {order.address.postalCode}
                  </p>
                  <p className="mt-2">Phone: {order.address.phoneNumber}</p>
                </div>
              </div>

              <div className="flex justify-between">
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => handleViewProof(order.proofOfPayment)}
                      className={"w-full"}
                    >
                      View Transaction Proof
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                      <DialogTitle>Transaction Proof</DialogTitle>
                      <div className="mt-4">
                        <h3 className="font-medium mb-4 text-center">
                          {formatDate(order.createdAt)}
                        </h3>
                        <div className="flex justify-center">
                          <Image
                            src={selectedProof}
                            alt="Payment proof"
                            width={500}
                            height={375}
                            className="object-contain rounded-md"
                          />
                        </div>
                      </div>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
