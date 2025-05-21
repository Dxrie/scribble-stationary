import connect from "@/app/lib/db";
import { ICart } from "@/app/lib/libs";
import CheckoutModel from "@/app/lib/models/checkout";
import ProductModel from "@/app/lib/models/product";
import UserModel from "@/app/lib/models/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connect();
    const users = await UserModel.countDocuments({ isAdmin: false });
    const products = await ProductModel.countDocuments();
    const checkouts = await CheckoutModel.find().populate("products.product");

    const checkoutTotal = checkouts
      .map((checkout) =>
        checkout.products
          .map((item: ICart) => {
            const price = item.product?.price || 0;
            const quantity = item.total || 1;
            return price * quantity;
          })
          .reduce((sum: number, val: number) => sum + val, 0),
      )
      .reduce((total, val) => total + val, 0);

    return NextResponse.json({
      users,
      products,
      checkouts: checkouts.length,
      checkoutTotal,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
