import {formatToCurrency, ICart} from "@/app/lib/libs";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Minus, Plus} from "lucide-react";

const CartItem = ({ item, selectedProducts, selectProduct, changeTotalItemCallback }: {
    item: ICart;
    selectedProducts: ICart[];
    selectProduct: (item: ICart) => void;
    changeTotalItemCallback: (productId: string, change: number) => void;
}) => (
    <div className="flex flex-wrap md:flex-nowrap items-center p-4 rounded-lg border bg-white shadow-sm gap-x-4 gap-y-2 w-full">
        <div
            className="size-7 bg-white border border-black rounded-full flex justify-center items-center cursor-pointer"
            onClick={() => selectProduct(item)}
        >
            {selectedProducts.some((p) => p.product._id === item.product._id) && (
                <div className="size-4 bg-primary rounded-full" />
            )}
        </div>
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 border flex items-center justify-center relative rounded-md overflow-hidden">
            <Image
                src={item.product.image || "/placeholder-image.png"}
                alt={item.product.name}
                layout="fill"
                objectFit="cover"
            />
        </div>
        <div className="ml-2 md:ml-4 flex-1 min-w-0">
            <p className="text-sm md:text-lg font-semibold line-clamp-2 pr-2">{item.product.name}</p>
            <p className="text-xs md:text-sm font-normal">Rp{formatToCurrency(item.product.price)}</p>
            <span className="text-xs md:text-sm">Total: {item.total}</span>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
            <Button variant="outline" size="icon" className="hover:bg-gray-200" onClick={() => changeTotalItemCallback(item.product._id, -1)}>
                <Minus size={16} />
            </Button>
            <Button variant="outline" size="icon" className="hover:bg-gray-200" onClick={() => changeTotalItemCallback(item.product._id, 1)}>
                <Plus size={16} />
            </Button>
        </div>
    </div>
);

export default CartItem;