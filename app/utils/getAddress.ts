import API_KEY from "@/apiKey";

async function getData(id: string | undefined) {
  const response = await fetch("/api/users/address", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": `${API_KEY}`,
    },
    body: JSON.stringify({
      id,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return await response.json();
}

export default function getAddress(id: string | undefined) {
    return getData(id);
}
