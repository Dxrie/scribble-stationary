import Categories from "./components/Categories";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Recommendation from "./components/Recommendation";
import Transition from "./components/Transition";

export default function Home() {
  return (
    <Transition>
      <div className="bg-background w-dvw h-[100vh] font-poppins">
        <Header />
        <Categories />
        <Recommendation />
        <Navbar currentIndex={0} />
      </div>
    </Transition>
  );
}
