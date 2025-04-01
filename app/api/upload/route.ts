import { NextResponse } from "next/server";
import ProductModel from "../../lib/models/product";
import connect from "@/app/lib/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    await connect();

    const body = await request.json();

    const fd = new FormData();
    fd.append("image", body.image);
    fd.append("type", "base64");
    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_ID}`,
      },
      body: fd,
      redirect: "follow",
    });
    const data = await response.json();

    const product = new ProductModel({
      name: body.formData.productName,
      description: body.formData.description,
      price: body.formData.price,
      stock: body.formData.stock,
      category: body.formData.category,
      image: data.data.link,
      isAvailable: true,
    });

    await product.save();

    return NextResponse.json(product, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json("An error occured: " + err.message, {
        status: 500,
      });
    } else {
      return NextResponse.json("An error occured.", { status: 500 });
    }
  }
}
