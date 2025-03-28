import API_KEY from "@/apiKey";

async function getData(userId: string | undefined) {
    const response = await fetch("/api/carts", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-api-key": `${API_KEY}`,
        },
        body: JSON.stringify({id: userId}),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch product: ${errorData.message}`);
    }

    return await response.json();
}

export default function getCart(userId: string | undefined) {
    return getData(userId);
}