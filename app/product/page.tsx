import Transition from "../components/Transition";
import ProductDisplay from "@/app/components/ProductDisplay";
import Navbar from "@/app/components/Navbar";

export default function Product() {
    return (
        <Transition>
            <ProductDisplay />
            <Navbar />
        </Transition>
    );
}
