import connect from "@/app/lib/db";
import ProductModel from "@/app/lib/models/product";
import {NextResponse} from "next/server";

export async function GET() {
  try {
    await connect();

    const products = await ProductModel.find();
    return NextResponse.json(products, {status: 200});
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({message: err.message}, {status: 500});
    }

    return NextResponse.json(
      {message: "An unexpected error occurred"},
      {status: 500}
    );
  }
}

export async function POST(request: Request) {
  try {
    await connect();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
          {message: "Product with that id wasn't found."},
          {status: 404}
      );
    }

    const product = await ProductModel.findById(body.id);

    if (!product) {
      return NextResponse.json(
          {message: "Product with that id wasn't found."},
          {status: 404}
      );
    }

    return NextResponse.json(product, {status: 200});
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json(
          {message: "An error occured: " + err.message},
          {status: 500}
      );
    } else {
      return NextResponse.json({message: "An error occured."}, {status: 500});
    }
  }
}
