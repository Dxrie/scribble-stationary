import { ShoppingCart } from "lucide-react";
import GoBack from "@/app/components/GoBack";
import Link from "next/link";

const ProductNavbar = () => {
  return (
    <div className="w-full py-2 px-5 flex items-center justify-between bg-background">
      <GoBack className="p-2 rounded-full cursor-pointer" />
      <h1 className="text-[18px]">Product Details</h1>
      <Link href="/cart">
        <div className="p-2 rounded-full cursor-pointer">
          <ShoppingCart />
        </div>
      </Link>
    </div>
  );
};

export default ProductNavbar;
