async function getData(userId: string | null) {
    const response = await fetch("/api/carts", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({id: userId}),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch product: ${errorData.message}`);
    }

    return await response.json();
}

export default function getCart(userId: string | null) {
    return getData(userId);
}