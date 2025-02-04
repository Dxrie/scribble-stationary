"use client";
import {formatToCurrency, IProduct, showSwal} from "@/app/lib/libs";
import Image from "next/image";
import {useCallback, useEffect, useState} from "react";
import {Favorite} from "@mui/icons-material";
import {useSearchParams} from "next/navigation";
import ProductNavbar from "@/app/components/ProductNavbar";

const ProductDisplay = () => {
    const searchParams = useSearchParams();
    const productId = searchParams.get("id");

    const [product, setProduct] = useState<IProduct | null>(null);

    const getProduct = useCallback(async () => {
        const response = await fetch("/api/products/search", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({id: productId}),
        });

        if (response.ok) {
            setProduct(await response.json());
        } else {
            const errorData = await response.json();
            showSwal("Error", `An error occurred: ${errorData.message}`, "error");
        }
    }, [productId]);

    useEffect(() => {
        getProduct();
    }, [getProduct]);

    return (
        <>
            <ProductNavbar productName={product?.name} />
            <div className="flex w-full flex-col">
                <div className="w-full aspect-square relative">
                    {product ? <Image
                        src={product?.image}
                        alt="Picture of the author"
                        layout="fill"
                        objectFit="cover" // change to suit your needs
                        className="lazy-load-image-background" // just an example
                    /> : <div className="w-full aspect-square animate-pulse bg-gray-300"></div>}
                </div>
                <div className="px-3 mt-2 flex flex-col gap-1">
                    <h1 className="text-xl font-semibold tracking-wider">Rp{formatToCurrency(product?.price)}</h1>
                    <div className="w-full flex gap-7 justify-between items-center">
                    <span className="flex flex-col">
                        <h1 className="text-[16px]">Pensil ini merupakan sebuah pensil yang bisa dibilang cukup hebat keren amazing dan dibuat oleh pabrik terkemuka di Australia</h1>
                    </span>
                        <div className="self-start"><Favorite className="text-2xl"/></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDisplay;