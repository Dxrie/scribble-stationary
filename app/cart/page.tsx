import CartHeader from "@/app/components/CartHeader";
import CartList from "@/app/components/CartList";
import PrivateRoute from "../components/PrivateRoute";

export default function Carts() {
  return (
    <PrivateRoute>
      <div className="w-full font-poppins h-screen bg-background relative">
        <CartHeader text={"My Cart"} />
        <CartList />
      </div>
    </PrivateRoute>
  );
}
