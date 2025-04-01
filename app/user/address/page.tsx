import CartHeader from "@/app/components/CartHeader";
import AddressList from "@/app/components/AddressList";
import PrivateRoute from "@/app/components/PrivateRoute";

export default function Address() {
  return (
    <PrivateRoute>
      <div className="bg-background w-full h-dvh">
        <CartHeader text="Addresses" />
        <AddressList />
      </div>
    </PrivateRoute>
  );
}
