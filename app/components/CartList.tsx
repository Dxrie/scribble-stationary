"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getCookie, setCookie } from "cookies-next/client";
import { decrypt, formatToCurrency, ICart, IProduct } from "@/app/lib/libs";
import { useQuery } from "@tanstack/react-query";
import getCart from "@/app/utils/getCart";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import Loading from "@/app/components/Loading";
import {debounce} from "lodash";

const CartList = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<IProduct[]>([]);
    const [total, setTotal] = useState<number>(0);

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

    const { data: cart, isFetching } = useQuery<ICart[]>({
        queryFn: () => getCart(userId),
        queryKey: ["carts"],
        initialData: [],
        retry: false,
        refetchOnWindowFocus: false,
        enabled: !!userId,
    });

    const cartItems = useMemo(() => cart ?? [], [cart]);

    const selectProduct = useCallback((item: ICart) => {
        setSelectedProducts((prevSelected) => {
            const isSelected = prevSelected.some((p) => p._id === item.product._id);
            return isSelected
                ? prevSelected.filter((p) => p._id !== item.product._id)
                : [...prevSelected, item.product];
        });

        setTotal((prevTotal) =>
            selectedProducts.some((p) => p._id === item.product._id)
                ? prevTotal - item.product.price * item.total
                : prevTotal + item.product.price * item.total
        );
    }, [selectedProducts]);

    const isSelectedAll = useMemo(() => selectedProducts.length === cartItems.length, [selectedProducts, cartItems]);

    const selectAll = useCallback(() => {
        if (isSelectedAll) {
            setSelectedProducts([]);
            setTotal(0);
        } else {
            const allProducts = cartItems.map((item) => item.product);
            setSelectedProducts(allProducts);
            setTotal(cartItems.reduce((sum, item) => sum + item.product.price * item.total, 0));
        }
    }, [cartItems, isSelectedAll]);

    const handleQuantityChange = useCallback((item: ICart, total: number) => {
        debounce(async () => {
        }, 500);
    }, []);

    return (
        <>
            <div className="w-full h-[85%] overflow-scroll flex flex-col gap-2 font-poppins pb-8 px-1">
                {isFetching && <Loading />}
                {cartItems.map((item) => (
                    <div
                        key={item.product._id}
                        className="flex flex-wrap md:flex-nowrap items-center p-4 rounded-lg border bg-white shadow-sm gap-x-4 gap-y-2 w-full"
                    >
                        <div
                            className="size-7 bg-white border border-black rounded-full flex justify-center items-center cursor-pointer"
                            onClick={() => selectProduct(item)}
                        >
                            {selectedProducts.some((p) => p._id === item.product._id) && (
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
                        </div>
                        <div className="flex items-center gap-1 md:gap-2">
                            <Button variant="outline" size="icon" className="hover:bg-gray-200" onClick={() => handleQuantityChange(item, -1)}>
                                <Minus size={16} />
                            </Button>
                            <span className="text-sm md:text-base">{item.total}</span>
                            <Button variant="outline" size="icon" className="hover:bg-gray-200" onClick={() => handleQuantityChange(item, 1)}>
                                <Plus size={16} />
                            </Button>
                        </div>
                    </div>
                ))}

            </div>

            <div className="w-full fixed bg-white bottom-0 flex border py-3 px-5 items-center justify-between">
                <div className="flex gap-2 items-center">
                    <div onClick={selectAll} className="size-6 border border-black rounded flex justify-center items-center cursor-pointer">
                        {isSelectedAll && <div className="size-4 bg-black rounded" />}
                    </div>
                    <h1 onClick={selectAll} className="text-lg">Select all</h1>
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
