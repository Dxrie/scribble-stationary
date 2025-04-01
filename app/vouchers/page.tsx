import CartHeader from "../components/CartHeader";
import Navbar from "../components/Navbar";
import PrivateRoute from "../components/PrivateRoute";
import VoucherList from "../components/VoucherList";

export default function Page() {
  return (
    <div className="w-full h-dvh font-poppins bg-background">
      <PrivateRoute>
        <CartHeader text="Vouchers" />
        <VoucherList />
        <Navbar currentIndex={3} />
      </PrivateRoute>
    </div>
  );
}
