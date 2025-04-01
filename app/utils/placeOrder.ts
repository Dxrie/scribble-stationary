import API_KEY from "@/apiKey";
import {getBase64, ICart} from "@/app/lib/libs";
import { IAddress } from "../lib/models/user";

async function postData(userId: string, products: ICart[], proofOfPayment: File, address: IAddress | undefined) {
    let base64Img = await getBase64(proofOfPayment);

    if (typeof base64Img === "string") {
        base64Img = base64Img.replace(/^data:.+base64,/, "");
    }

    const formattedProducts = products.map((p) => ({
        product: p.product._id,
        total: p.total,
    }));

    const response = await fetch("/api/checkout/create", {
        method: "POST",
        body: JSON.stringify({userId, products: formattedProducts, proofOfPayment: base64Img, address}),
        headers: {
            "x-api-key": `${API_KEY}`,
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return await response.json();
}

export default function placeOrder(userId: string, products: ICart[], proofOfPayment: File, address: IAddress | undefined) {
    return postData(userId, products, proofOfPayment, address);
}