import Transition from "../components/Transition";
import ProductDisplay from "@/app/components/ProductDisplay";

export default function Product() {
    return (
        <Transition>
            <ProductDisplay />
        </Transition>
    );
}
