"use client";
import { decrypt, formatToCurrency, IProduct, showSwal } from "@/app/lib/libs";
import Image from "next/image";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Favorite } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import ProductNavbar from "@/app/components/ProductNavbar";
import Loading from "@/app/components/Loading";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import getProduct from "@/app/utils/getProduct";
import addToCart from "@/app/utils/addToCart";
import { getCookie, setCookie } from "cookies-next/client";

const ProductDisplayContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const { data, error } = useQuery<IProduct>({
    queryFn: () => getProduct(productId),
    queryKey: ["product"],
    retry: false,
    refetchOnWindowFocus: false,
  });

  const product = useMemo(() => data ?? null, [data]);

  const mutation = useMutation({
    mutationFn: (data: { productId: string; userId: string }) =>
      addToCart(data.productId, data.userId, 1),
    onSuccess: (data) => {
      showSwal("Success", data.message, "success");
    },
    onError: (error) => {
      showSwal("Error", error.message, "error");
    },
  });

  const addToCartCallback = useCallback(() => {
    if (mutation.isPending) return;

    if (!(productId && userId))
      return showSwal(
        "Error",
        "Please create an account or login before adding this item to cart.",
        "error",
      );

    mutation.mutate({ productId, userId });
  }, [mutation, productId, userId]);

  useEffect(() => {
    if (error instanceof Error) {
      showSwal("Error", error.message, "error");
      router.push("/");
    }
  }, [error]);

  useEffect(() => {
    const decryptFunc = async () => {
      const cookie = getCookie("session");

      if (cookie) {
        try {
          const payload = (await decrypt(cookie)) as { data: { _id: string } };

          if (payload) {
            setUserId(payload.data._id);
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.log(err.message);
            setCookie("session", "", { expires: new Date(0) });
          } else {
            console.log("An error occured.");
          }
        }
      }
    };

    decryptFunc();
  }, []);

  return (
    <>
      <ProductNavbar />
      <div className="flex w-dvw h-full flex-col relative bg-background">
        {" "}
        {/* Add padding-bottom to prevent content from being hidden behind the fixed button */}
        <div
          className={`w-full border-gray-600 border-[0.02px] aspect-square relative bg-gray-300 ${imageLoaded ? "bg-transparent" : "animate-pulse"}`}
        >
          {product ? (
            <Image
              src={product?.image}
              alt="Picture of the author"
              layout="fill"
              objectFit="cover" // change to suit your needs
              className="lazy-load-image-background" // just an example
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className="w-full aspect-square animate-pulse bg-gray-300"></div>
          )}
        </div>
        <div className="px-3 mt-2 flex flex-col gap-1 w-full">
          <div className="w-full flex justify-between items-center">
            <h1 className="text-xl uppercase tracking-tight font-semibold">
              {product?.name}
            </h1>
            <div className="self-start">
              <Favorite className="text-3xl" />
            </div>
          </div>
          <h1 className="block w-full px-2 py-2 rounded-lg font-normal bg-primary text-white text-lg">
            Rp{formatToCurrency(product?.price)}
          </h1>
        </div>
        {/* Scrollable Description Container */}
        <div className="px-3 pb-3 mt-2 flex flex-col w-full">
          {" "}
          {/* Set a fixed height and enable vertical scrolling */}
          <p className="text-[14px] text-justify">{product?.description}</p>
        </div>
      </div>
      {/* Fixed Button at the Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-3 shadow-lg">
        {" "}
        {/* Fixed positioning and styling for the button */}
        <Button
          onClick={addToCartCallback}
          className="w-full rounded-xl text-lg font-semibold py-6"
        >
          {mutation.isPending ? "Adding To Cart..." : "Add To Cart"}
        </Button>
      </div>
    </>
  );
};

export default function ProductDisplay() {
  return (
    <Suspense fallback={<Loading />}>
      <ProductDisplayContent />
    </Suspense>
  );
}
