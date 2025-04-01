import API_KEY from "@/apiKey";

async function postData(
  total: number,
  productId: string,
  userId: string | null
) {
  const response = await fetch("/api/carts/changeTotal", {
    headers: {
      "x-api-key": `${API_KEY}`,
    },
    method: "POST",
    body: JSON.stringify({
      total,
      productId,
      userId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return await response.json();
}

export default function changeTotal(
  total: number,
  productId: string,
  userId: string | null
) {
  return postData(total, productId, userId);
}
