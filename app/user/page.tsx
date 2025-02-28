import CartHeader from "../components/CartHeader";
import Navbar from "../components/Navbar";
import PrivateRoute from "../components/PrivateRoute";
import UserProfileComponent from "../components/UserProfileComponent";

export default function UserPage() {
  return (
    <PrivateRoute>
      <div className="w-full h-dvh bg-background">
        <CartHeader text="My Account" />
        <UserProfileComponent />
        <Navbar />
      </div>
    </PrivateRoute>
  );
}
