import API_KEY from "@/apiKey";

async function getData(productId: string | null) {
    const response = await fetch("/api/products", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-api-key": `${API_KEY}`,
        },
        body: JSON.stringify({id: productId}),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch product: ${errorData.message}`);
    }

    return await response.json();
}

export default function getProduct(productId: string | null) {
    return getData(productId);
}