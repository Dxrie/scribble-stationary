import {ShoppingBag} from "lucide-react";
import GoBack from "@/app/components/GoBack";
import Link from "next/link";

const ProductNavbar = ({productName}: {productName: string | undefined}) => {
    return <div className="w-full py-2 px-5 flex items-center justify-between">
        <GoBack className="p-2 rounded-full cursor-pointer" />
        <h1 className="text-[18px]">{productName}</h1>
        <Link href="/carts"><div className="p-2 rounded-full cursor-pointer"><ShoppingBag/></div></Link>
    </div>
};

export default ProductNavbar;