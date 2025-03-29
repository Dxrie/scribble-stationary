import CartHeader from "@/app/components/CartHeader";
import PrivateRoute from "@/app/components/PrivateRoute";

export default function Orders() {
  return (
    <PrivateRoute>
      <CartHeader text="History" />
    </PrivateRoute>
  );
}
