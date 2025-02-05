const getData = async () => {
    const response = await fetch("/api/products", {
        method: "GET",
        headers: {
            accept: "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to fetch products: ${errorData.message}`);
    }

    return response.json();
};

export default function getProducts() {
    return getData(); // Return the Promise directly
}
