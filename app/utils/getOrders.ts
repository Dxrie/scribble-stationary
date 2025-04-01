import API_KEY from "@/apiKey";

async function getData(userId: string | undefined) {
  const response = await fetch(`/api/checkout/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-api-key": `${API_KEY}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to fetch order history: ${errorData.message}`);
  }

  return await response.json();
}

export default function getOrders(userId: string | undefined) {
  return getData(userId);
}
