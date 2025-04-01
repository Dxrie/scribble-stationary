import CartHeader from "@/app/components/CartHeader";
import OrderList from "@/app/components/OrderList";
import PrivateRoute from "@/app/components/PrivateRoute";

export default function Orders() {
  return (
    <PrivateRoute>
      <CartHeader text="History" />
      <OrderList />
    </PrivateRoute>
  );
}
