import Categories from "./components/Categories";
import Header from "./components/Header";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="bg-[#264653] w-full h-[100dvh]">
      <Header />
      <Categories />
      <Navbar />
    </div>
  );
}
