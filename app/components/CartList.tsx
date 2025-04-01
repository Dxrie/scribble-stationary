"use client";

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { formatToCurrency, ICart, showSwal } from "@/app/lib/libs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getCart from "@/app/utils/getCart";
import { Button } from "@/components/ui/button";
import Loading from "@/app/components/Loading";
import changeTotal from "@/app/utils/changeTotal";
import _ from "lodash";
import CartItem from "@/app/components/CartItem";
import { UserContext } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";

const CartList = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const userContext = useContext(UserContext);
  const [selectedProducts, setSelectedProducts] = useState<ICart[]>([]);

  if (!userContext) {
    throw new Error("UserContext must be used within a user context");
  }

  const { user, isLoadingUser, setCheckoutItems } = userContext;

  useEffect(() => {
    if (!isLoadingUser && !user) {
      showSwal(
        "Error",
        "You need to be logged in to be able to view your cart.",
        "error",
      );
      router.push("/");
    }
  }, [isLoadingUser, router, user]);

  const { data: cart, isFetching } = useQuery<ICart[]>({
    queryFn: () => getCart(user?._id),
    queryKey: ["carts"],
    initialData: [],
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!user?._id,
  });

  const mutation = useMutation({
    mutationFn: (data: {
      total: number;
      productId: string;
      userId: string | null;
    }) => changeTotal(data.total, data.productId, data.userId),
  });

  const cartItems = useMemo(() => cart ?? [], [cart]);

  // Calculate total using useMemo
  const total = useMemo(() => {
    return selectedProducts.reduce(
      (sum, item) => sum + item.product.price * item.total,
      0,
    );
  }, [selectedProducts]);

  const selectProduct = useCallback((item: ICart) => {
    setSelectedProducts((prevSelected) => {
      const isSelected = prevSelected.some(
        (p) => p.product._id === item.product._id,
      );
      return isSelected
        ? prevSelected.filter((p) => p.product._id !== item.product._id)
        : [...prevSelected, item];
    });
  }, []);

  const isSelectedAll = useMemo(
    () => selectedProducts.length === cartItems.length,
    [selectedProducts, cartItems],
  );

  const selectAll = useCallback(() => {
    if (isSelectedAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(cartItems);
    }
  }, [cartItems, isSelectedAll]);

  const fetchChangeTotalItemServerCallback = useMemo(
    () =>
      _.debounce((total: number, productId: string, userId: string | null) => {
        mutation.mutate({ total, productId, userId });
      }, 1000),
    [],
  );

  const changeTotalItemCallback = useCallback(
    (productId: string, change: number) => {
      queryClient.setQueryData(["carts"], (oldData: ICart[] | undefined) => {
        if (!oldData) return oldData;

        const product = oldData.find((item) => item.product._id === productId);

        if (!product) {
          showSwal("Error", "Product not found.", "error");
          return oldData;
        }

        if (product.total + change < 1) {
          // Remove the item from selected products
          setSelectedProducts((prevSelected) =>
            prevSelected.filter((item) => item.product._id !== productId),
          );
          // Remove the item from cart data and notify server
          fetchChangeTotalItemServerCallback(0, productId, user?._id);
          return oldData.filter((item) => item.product._id !== productId);
        }

        if (product.total + change > product.product.stock) {
          showSwal(
            "Error",
            "Product quantity cannot be more than stock.",
            "error",
          );
          return oldData;
        }

        const updatedData = oldData.map((item) =>
          item.product._id === productId
            ? { ...item, total: item.total + change }
            : item,
        );

        setSelectedProducts((prevSelected) =>
          prevSelected.map((item) =>
            item.product._id === productId
              ? { ...item, total: item.total + change }
              : item,
          ),
        );

        const updatedItem = updatedData.find(
          (item) => item.product._id === productId,
        );

        if (updatedItem) {
          fetchChangeTotalItemServerCallback(
            updatedItem.total,
            productId,
            user?._id,
          );
        }

        return updatedData;
      });
    },
    [queryClient, fetchChangeTotalItemServerCallback, user?._id],
  );

  const addToCheckout = useCallback(() => {
    setCheckoutItems(selectedProducts);
    router.push("/cart/checkout");
  }, [setCheckoutItems, selectedProducts, router]);

  return (
    <>
      <div className="w-full h-[85%] overflow-scroll flex flex-col gap-2 font-poppins pb-8 px-1">
        {isFetching && <Loading />}
        {cartItems.map((item) => (
          <CartItem
            key={item.product._id}
            item={item}
            selectedProducts={selectedProducts}
            selectProduct={selectProduct}
            changeTotalItemCallback={changeTotalItemCallback}
          />
        ))}
      </div>

      <div className="w-full fixed bg-white bottom-0 flex flex-col gap-4 border py-3 px-5 items-center justify-between">
        <div className="w-full flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <div
              onClick={selectAll}
              className="size-6 border border-black rounded flex justify-center items-center cursor-pointer"
            >
              {isSelectedAll && <div className="size-4 bg-primary rounded" />}
            </div>
            <h1 onClick={selectAll} className="text-lg cursor-pointer">
              Select all
            </h1>
          </div>
          <h1 className="font-semibold text-lg">
            Rp {formatToCurrency(total)}
          </h1>
        </div>
        <Button className="w-full" onClick={addToCheckout}>
          Check Out
        </Button>
      </div>
    </>
  );
};

export default CartList;
