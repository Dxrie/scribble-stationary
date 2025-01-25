import Categories from "./components/Categories";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Recommendation from "./components/Recommendation";

export default function Home() {
  return (
    <div className="bg-[#264653] w-full h-[100dvh]">
      <Header />
      <Categories />
      <Recommendation />
      <Navbar />
    </div>
  );
}
