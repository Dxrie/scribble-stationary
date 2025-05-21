import GoBack from "@/app/components/GoBack";
import Link from "next/link";
import { Home } from "lucide-react";

const CartHeader = ({ text }: { text: string }) => {
  return (
    <div className="w-full py-2 px-5 flex items-center justify-between">
      <GoBack className="p-2 rounded-full cursor-pointer" />
      <h1 className="text-[18px]">{text}</h1>
      <Link href="/">
        <div className="p-2 rounded-full cursor-pointer">
          <Home />
        </div>
      </Link>
    </div>
  );
};

export default CartHeader;
