"use client";

import CartHeader from "@/app/components/CartHeader";
import {
  ArrowForwardIos,
  Bolt,
  LocationOn,
  Wallet,
  Discount,
} from "@mui/icons-material";
import UploadForm from "@/app/components/UploadForm";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {formatToCurrency, ICart, showSwal} from "@/app/lib/libs";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {UserContext} from "@/app/context/UserContext";
import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import placeOrder from "@/app/utils/placeOrder";
import Link from "next/link";
import PrivateRoute from "@/app/components/PrivateRoute";

export default function Checkout() {
  const router = useRouter();
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null);
  const [isCheckoutSuccessful, setIsCheckoutSuccessful] =
    useState<boolean>(false);
  const userContext = useContext(UserContext);

  const mutation = useMutation({
    mutationFn: (data: {
      userId: string;
      products: ICart[];
      proofOfPayment: File;
      address: string;
    }) =>
      placeOrder(data.userId, data.products, data.proofOfPayment, data.address),
    onSuccess: (data) => {
      showSwal("Success", data.message, "success");
      setIsCheckoutSuccessful(true);
      setCheckoutItems([]);
      router.push("/");
    },
    onError: (error) => {
      showSwal("Error", error.message, "error");
    },
  });

  if (!userContext) {
    throw new Error("UserContext must be used within a user context");
  }

  const {user, checkoutItems, setCheckoutItems} = userContext;

  const subtotal = useMemo(() => {
    return checkoutItems.reduce(
      (total, item) => total + item.product.price * item.total,
      0
    );
  }, [checkoutItems]);

  const placeOrderCallback = useCallback(() => {
    const userId = user?._id;
    const products = checkoutItems;
    const address = "Sigma sigma";

    if (!userId) {
      showSwal("Error", "You are not logged in.", "error");
      return;
    }

    if (!proofOfPayment) {
      showSwal("Error", "Please upload the proof of payment.", "error");
      return;
    }

    mutation.mutate({userId, products, proofOfPayment, address});
  }, [checkoutItems, mutation, proofOfPayment, user?._id]);

  useEffect(() => {
    if (checkoutItems.length <= 0 && !isCheckoutSuccessful) {
      router.push("/cart");
    }
  }, [checkoutItems, router, user?._id, isCheckoutSuccessful]);

  return (
    <PrivateRoute>
      <div className="w-full h-dvh bg-background relative">
        <CartHeader text={"Checkout"} />
        <div className="w-full flex flex-col items-center bg-transparent relative gap-4 pb-4">
          <Link href={"/user/address"} className="w-[90%]">
            <div className="flex w-full items-center justify-between border rounded-lg py-4 gap-[5%] px-[5%]">
              <div className="flex items-center h-full gap-[5%]">
                <LocationOn className="text-primary" fontSize="large" />
                <div className="flex flex-col">
                  <p>Deliver to</p>
                  <h1 className="text-lg font-semibold line-clamp-1">
                    Home - Dirgandini, No 8
                  </h1>
                </div>
              </div>
              <ArrowForwardIos className="text-primary" fontSize="medium" />
            </div>
          </Link>

          <div className="flex flex-col w-[90%] gap-5">
            <p>Payment Method</p>
            <div className="flex flex-col w-full">
              <div className="flex w-full items-center justify-between border rounded-lg py-3 gap-[5%] px-[5%]">
                <div className="flex items-center h-full gap-[10%]">
                  <Wallet className="text-primary" fontSize="large" />
                  <h1 className="font-semibold">Transfer</h1>
                </div>
                <ArrowForwardIos className="text-primary" fontSize="medium" />
              </div>
            </div>

            <UploadForm setProofOfPayment={setProofOfPayment} />

            <ul className="space-y-2">
              {checkoutItems?.map((item) => (
                <div
                  key={item.product._id}
                  className="flex flex-wrap md:flex-nowrap items-center p-4 rounded-lg border bg-white gap-x-4 gap-y-2 w-full"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 border flex items-center justify-center relative rounded-md overflow-hidden">
                    <Image
                      src={item.product.image || "/placeholder-image.png"}
                      alt={item.product.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="ml-2 md:ml-4 flex-1 min-w-0">
                    <p className="text-sm md:text-lg font-semibold line-clamp-2 pr-2">
                      {item.product.name}
                    </p>
                    <p className="text-xs md:text-sm font-normal">
                      Rp{formatToCurrency(item.product.price)}
                    </p>
                    <span className="text-xs md:text-sm">
                      Total: {item.total}
                    </span>
                  </div>
                </div>
              ))}
            </ul>

            <hr />

            <div className="flex flex-col w-full gap-2">
              <h1>Delivery Method</h1>
              <div className="flex w-full items-center justify-between border rounded-lg py-4 gap-[5%] px-[5%]">
                <div className="flex flex-col">
                  <h1>Express</h1>
                  <p className="text-sm">Estimated arrived 20-29 December</p>
                </div>
                <Bolt fontSize="large" className={"text-primary"} />
              </div>
            </div>

            <div className="flex flex-col w-full gap-2">
              <h1>Voucher</h1>
              <div className="flex w-full items-center justify-between border rounded-lg py-4 gap-[5%] px-[5%]">
                <div className="flex flex-col">
                  <h1>No voucher selected</h1>
                  {/*<p className="text-sm">Estimated arrived 20-29 December</p>*/}
                </div>
                <Discount fontSize="large" className={"text-primary"} />
              </div>
            </div>

            <div className="w-full flex flex-col gap-2">
              <div className="flex flex-col w-full">
                <div className="flex justify-between w-full">
                  <h1>Subtotal</h1>
                  <h1>IDR {formatToCurrency(subtotal)}</h1>
                </div>
                <div className="flex justify-between w-full">
                  <h1>Voucher</h1>
                  <h1>-IDR {formatToCurrency(25000)}</h1>
                </div>
                <div className="flex justify-between w-full">
                  <h1>Delivery Charge</h1>
                  <h1>IDR {formatToCurrency(25000)}</h1>
                </div>
              </div>
              <hr />
              <div className="flex justify-between w-full">
                <h1>Total</h1>
                <h1>IDR {formatToCurrency(1000000)}</h1>
              </div>
            </div>

            <Button onClick={placeOrderCallback}>Place Order</Button>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}
