import CartHeader from "@/app/components/CartHeader";
import CartList from "@/app/components/CartList";

export default function Carts() {
    return <div className="w-full h-screen bg-background relative">
        <CartHeader/>
        <CartList />
    </div>
}