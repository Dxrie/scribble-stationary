"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getCookie, setCookie } from "cookies-next/client";
import { decrypt, formatToCurrency, ICart, showSwal } from "@/app/lib/libs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getCart from "@/app/utils/getCart";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import Loading from "@/app/components/Loading";
import changeTotal from "@/app/utils/changeTotal";
import _ from "lodash";

// Custom Hook for User ID
const useUserId = () => {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const decryptFunc = async () => {
            const cookie = getCookie("session");
            if (!cookie) return;

            try {
                const payload = (await decrypt(cookie)) as { data: { _id: string } };
                if (payload?.data?._id) setUserId(payload.data._id);
            } catch (error) {
                console.error("Failed to decrypt session:", error);
                setCookie("session", "", { expires: new Date(0) });
            }
        };

        decryptFunc();
    }, []);

    return userId;
};

// Cart Item Component
const CartItem = ({ item, selectedProducts, selectProduct, changeTotalItemCallback }: {
    item: ICart;
    selectedProducts: ICart[];
    selectProduct: (item: ICart) => void;
    changeTotalItemCallback: (productId: string, change: number) => void;
}) => (
    <div className="flex flex-wrap md:flex-nowrap items-center p-4 rounded-lg border bg-white shadow-sm gap-x-4 gap-y-2 w-full">
        <div
            className="size-7 bg-white border border-black rounded-full flex justify-center items-center cursor-pointer"
            onClick={() => selectProduct(item)}
        >
            {selectedProducts.some((p) => p.product._id === item.product._id) && (
                <div className="size-4 bg-gray-700 rounded-full" />
            )}
        </div>
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 border flex items-center justify-center relative rounded-md overflow-hidden">
            <Image
                src={item.product.image || "/placeholder-image.png"}
                alt={item.product.name}
                layout="fill"
                objectFit="cover"
            />
        </div>
        <div className="ml-2 md:ml-4 flex-1 min-w-0">
            <p className="text-sm md:text-lg font-semibold line-clamp-2 pr-2">{item.product.name}</p>
            <p className="text-xs md:text-sm font-normal">Rp{formatToCurrency(item.product.price)}</p>
            <span className="text-xs md:text-sm">Total: {item.total}</span>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
            <Button variant="outline" size="icon" className="hover:bg-gray-200" onClick={() => changeTotalItemCallback(item.product._id, -1)}>
                <Minus size={16} />
            </Button>
            <Button variant="outline" size="icon" className="hover:bg-gray-200" onClick={() => changeTotalItemCallback(item.product._id, 1)}>
                <Plus size={16} />
            </Button>
        </div>
    </div>
);

const CartList = () => {
    const queryClient = useQueryClient();
    const userId = useUserId();
    const [selectedProducts, setSelectedProducts] = useState<ICart[]>([]);

    const { data: cart, isFetching } = useQuery<ICart[]>({
        queryFn: () => getCart(userId),
        queryKey: ["carts"],
        initialData: [],
        retry: false,
        refetchOnWindowFocus: false,
        enabled: !!userId,
    });

    const mutation = useMutation({
        mutationFn: (data: { total: number, productId: string, userId: string | null }) =>
            changeTotal(data.total, data.productId, data.userId),
    });

    const cartItems = useMemo(() => cart ?? [], [cart]);

    // Calculate total using useMemo
    const total = useMemo(() => {
        return selectedProducts.reduce((sum, item) => sum + item.product.price * item.total, 0);
    }, [selectedProducts]);

    const selectProduct = useCallback((item: ICart) => {
        setSelectedProducts((prevSelected) => {
            const isSelected = prevSelected.some((p) => p.product._id === item.product._id);
            return isSelected
                ? prevSelected.filter((p) => p.product._id !== item.product._id)
                : [...prevSelected, item];
        });
    }, []);

    const isSelectedAll = useMemo(() => selectedProducts.length === cartItems.length, [selectedProducts, cartItems]);

    const selectAll = useCallback(() => {
        if (isSelectedAll) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(cartItems);
        }
    }, [cartItems, isSelectedAll]);

    const fetchChangeTotalItemServerCallback = useMemo(() =>
            _.debounce((total: number, productId: string, userId: string | null) => {
                mutation.mutate({ total, productId, userId });
            }, 500),
        []);

    const changeTotalItemCallback = useCallback(
        (productId: string, change: number) => {
            queryClient.setQueryData(["carts"], (oldData: ICart[] | undefined) => {
                if (!oldData) return oldData;

                const product = oldData.find(item => item.product._id === productId);

                if (!product) {
                    showSwal("Error", "Product not found.", "error");
                    return oldData;
                }

                if (product.total + change < 1) {
                    showSwal("Error", "Product quantity cannot be less than 1.", "error");
                    return oldData;
                }

                if (product.total + change > product.product.stock) {
                    showSwal("Error", "Product quantity cannot be more than stock.", "error");
                    return oldData;
                }

                const updatedData = oldData.map(item =>
                    item.product._id === productId
                        ? { ...item, total: item.total + change }
                        : item
                );

                setSelectedProducts((prevSelected) =>
                    prevSelected.map((item) =>
                        item.product._id === productId
                            ? { ...item, total: item.total + change }
                            : item
                    )
                );

                const updatedItem = updatedData.find(item => item.product._id === productId);

                if (updatedItem) {
                    fetchChangeTotalItemServerCallback(updatedItem.total, productId, userId);
                }

                return updatedData;
            });
        },
        [queryClient, fetchChangeTotalItemServerCallback, userId]
    );

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

            <div className="w-full fixed bg-white bottom-0 flex border py-3 px-5 items-center justify-between">
                <div className="flex gap-2 items-center">
                    <div onClick={selectAll}
                         className="size-6 border border-black rounded flex justify-center items-center cursor-pointer">
                        {isSelectedAll && <div className="size-4 bg-black rounded" />}
                    </div>
                    <h1 onClick={selectAll} className="text-lg cursor-pointer">Select all</h1>
                </div>
                <div className="flex flex-col">
                    <h1>Total</h1>
                    <h1 className="font-semibold">IDR {formatToCurrency(total)}</h1>
                </div>
                <Button>Check Out</Button>
            </div>
        </>
    );
};

export default CartList;