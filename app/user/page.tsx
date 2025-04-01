import Navbar from "../components/Navbar";
import PrivateRoute from "../components/PrivateRoute";
import UserProfileComponent from "../components/UserProfileComponent";
import UserHeader from "../components/UserHeader";
import Transition from "../components/Transition";

export default function UserPage() {
  return (
    <PrivateRoute>
      <Transition>
        <div className="w-full h-dvh font-poppins bg-background">
          <UserHeader />
          <UserProfileComponent />
          <Navbar currentIndex={3} />
        </div>
      </Transition>
    </PrivateRoute>
  );
}
