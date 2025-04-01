import { NextResponse } from "next/server";
import CheckoutModel from "@/app/lib/models/checkout";
import connect from "@/app/lib/db";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await context.params).id;

    await connect();

    const checkouts = await CheckoutModel.find({ userId: id })
      .populate({
        path: "products.product",
        model: "Product",
        select: "name price image category",
      })
      .exec();

    return NextResponse.json(checkouts, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
