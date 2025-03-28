import API_KEY from "@/apiKey";

async function getData() {
    const response = await fetch("/api/vouchers", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": `${API_KEY}`
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return await response.json();
}

export function getVouchers() {
    return getData();
}