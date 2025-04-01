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
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { formatToCurrency, ICart, showSwal } from "@/app/lib/libs";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import placeOrder from "@/app/utils/placeOrder";
import Link from "next/link";
import PrivateRoute from "@/app/components/PrivateRoute";
import { IAddress } from "@/app/lib/models/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { IVoucher } from "@/app/lib/models/voucher";
import API_KEY from "@/apiKey";

export default function Checkout() {
  const DELIVERY = 25000;

  const router = useRouter();
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null);
  const [isCheckoutSuccessful, setIsCheckoutSuccessful] =
    useState<boolean>(false);
  const [isVoucherDialogOpen, setIsVoucherDialogOpen] =
    useState<boolean>(false);
  const voucherRef = useRef<HTMLInputElement>(null);
  const [currentVoucher, setCurrentVoucher] = useState<IVoucher | null>(null);
  const userContext = useContext(UserContext);

  const handleApplyVoucher = async (voucherCode: string) => {
    if (!voucherCode) {
      showSwal("Error", "Voucher code cannot be empty.", "error");
      setIsVoucherDialogOpen(false);
      return;
    }

    const response = await fetch(`/api/vouchers/${voucherCode}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      showSwal("Error", errorData.message, "error");
      setIsVoucherDialogOpen(false);
      return;
    }

    const voucherData = await response.json();
    setCurrentVoucher(voucherData);
    showSwal("Success", "Voucher applied successfully.", "success");
    setIsVoucherDialogOpen(false);
  };

  const mutation = useMutation({
    mutationFn: (data: {
      userId: string;
      products: ICart[];
      proofOfPayment: File;
      address: IAddress | undefined;
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
  const { user, checkoutItems, setCheckoutItems, defaultAddress } = userContext;
  const subtotal = useMemo(() => {
    return checkoutItems.reduce(
      (total, item) => total + item.product.price * item.total,
      0,
    );
  }, [checkoutItems]);

  const placeOrderCallback = useCallback(() => {
    const userId = user?._id;
    const products = checkoutItems;
    const address = defaultAddress;

    if (!userId) {
      showSwal("Error", "You are not logged in.", "error");
      return;
    }

    if (!proofOfPayment) {
      showSwal("Error", "Please upload the proof of payment.", "error");
      return;
    }

    mutation.mutate({ userId, products, proofOfPayment, address });
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
                  <p>Address</p>
                  {defaultAddress ? (
                    <h1 className="text-lg font-semibold line-clamp-1">
                      {defaultAddress.streetAddress}
                    </h1>
                  ) : null}
                </div>
              </div>
              <ArrowForwardIos className="text-primary" fontSize="medium" />
            </div>
          </Link>

          <div className="flex flex-col w-[90%] gap-5">
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

            <Dialog
              open={isVoucherDialogOpen}
              onOpenChange={setIsVoucherDialogOpen}
            >
              <DialogTrigger onClick={() => setIsVoucherDialogOpen(true)}>
                <div className="flex flex-col w-full gap-2 items-start">
                  <h1>Voucher</h1>
                  <div className="flex w-full items-center justify-between border rounded-lg py-4 gap-[5%] px-[5%]">
                    <div className="flex flex-col">
                      <h1>
                        {currentVoucher
                          ? currentVoucher.voucherName
                          : "No voucher selected"}
                      </h1>
                    </div>
                    <Discount fontSize="large" className={"text-primary"} />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Input Voucher Code</DialogTitle>
                  <DialogDescription className="text-gray-700">
                    Please input the voucher code you have received.
                  </DialogDescription>
                </DialogHeader>
                <Input
                  ref={voucherRef}
                  maxLength={6}
                  type="text"
                  placeholder="XXXXXX"
                  className="placeholder:text-gray-400"
                />
                <Link
                  className="text-center text-sm text-secondary underline"
                  href={"/vouchers"}
                >
                  Look at vouchers list
                </Link>
                <DialogFooter>
                  <div className="flex flex-col gap-1">
                    <Button
                      onClick={() =>
                        handleApplyVoucher(voucherRef.current?.value as string)
                      }
                    >
                      Apply
                    </Button>
                    {currentVoucher ? (
                      <Button
                        variant={"destructive"}
                        onClick={() => {
                          setCurrentVoucher(null);
                          setIsVoucherDialogOpen(false);
                        }}
                      >
                        Remove Voucher
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="w-full flex flex-col gap-2">
              <div className="flex flex-col w-full">
                <div className="flex justify-between w-full">
                  <h1>Subtotal</h1>
                  <h1>Rp {formatToCurrency(subtotal)}</h1>
                </div>
                <div className="flex justify-between w-full">
                  <h1>Voucher</h1>
                  <h1>
                    {currentVoucher
                      ? `-Rp ${formatToCurrency(subtotal * (currentVoucher.discountPercentage / 100))}`
                      : "-Rp 0"}
                  </h1>
                </div>
                <div className="flex justify-between w-full">
                  <h1>Delivery Charge</h1>
                  <h1>Rp {formatToCurrency(DELIVERY)}</h1>
                </div>
              </div>
              <hr />
              <div className="flex justify-between w-full">
                <h1>Total</h1>
                <h1>
                  Rp{" "}
                  {formatToCurrency(
                    subtotal -
                      subtotal *
                        (currentVoucher
                          ? currentVoucher.discountPercentage / 100
                          : 0) +
                      DELIVERY,
                  )}
                </h1>
              </div>
            </div>

            <div className="flex flex-col w-full">
              <div className="flex w-full items-center justify-between border rounded-lg py-3 gap-[5%] px-[5%]">
                <div className="flex items-center h-full gap-[10%]">
                  <div className="flex flex-col">
                    <h1 className="font-semibold text-lg">
                      BCA Virtual Account
                    </h1>
                    <h3 className="font-normal text-sm">244201241241412</h3>
                  </div>
                </div>
                <Wallet className="text-primary" fontSize="large" />
              </div>
            </div>

            <UploadForm setProofOfPayment={setProofOfPayment} />

            <Button onClick={placeOrderCallback}>Place Order</Button>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}
