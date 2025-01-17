import connect from "@/app/lib/db";
import ProductModel from "@/app/lib/models/product";
import {NextResponse} from "next/server";

export async function GET() {
  try {
    await connect();

    const products = await ProductModel.find();
    return NextResponse.json(products, {status: 200});
  } catch (err: any) {
    return NextResponse.json({message: err.message}, {status: 500});
  }
}
