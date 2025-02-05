import Categories from "./components/Categories";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Recommendation from "./components/Recommendation";
import Transition from "./components/Transition";

export default function Home() {
  return (
    <Transition>
      <div className="bg-[#FAF9F6] w-full h-[100vh] font-poppins">
        <Header />
        <Categories />
        <Recommendation />
        <Navbar />
      </div>
    </Transition>
  );
}
