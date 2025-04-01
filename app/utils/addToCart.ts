import API_KEY from "@/apiKey";

async function postData(productId: string | null | undefined, userId: string | null | undefined, total: number | null | undefined) {
    const response = await fetch("/api/carts/add", {
        method: "POST",
        body: JSON.stringify({itemId: productId, userId, total}),
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

export default function addToCart(productId: string | null | undefined, userId: string | null | undefined, total: number | null | undefined) {
    return postData(productId, userId, total);
}