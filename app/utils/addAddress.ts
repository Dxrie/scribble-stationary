import API_KEY from "@/apiKey";
import {IAddress} from "../lib/models/user";

async function postData(id: string | undefined, address: IAddress) {
  const addressWithoutId = Object.fromEntries(
    Object.entries(address).filter(([key]) => key !== '_id')
  );

  const response = await fetch("/api/users/address/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": `${API_KEY}`,
    },
    body: JSON.stringify({
      id,
      address: addressWithoutId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add address");
  }

  return await response.json();
}

export default function addAddress(id: string | undefined, address: IAddress) {
  return postData(id, address);
}
