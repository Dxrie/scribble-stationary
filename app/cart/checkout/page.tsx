import CartHeader from "@/app/components/CartHeader";
import {LocationOn, Wallet, ArrowForwardIos} from "@mui/icons-material";
import UploadForm from "@/app/components/UploadForm";

export default function Checkout() {
    return <div className="w-full h-screen bg-background relative">
        <CartHeader text={"Checkout"}/>
        <div className="w-full flex flex-col items-center bg-transparent relative gap-4">
            <div className="flex w-[90%] items-center justify-between border rounded-lg py-4 gap-[5%] px-[5%]">
                <div className="flex items-center h-full gap-[5%]">
                    <LocationOn fontSize="large" />
                    <div className="flex flex-col">
                        <p>Deliver to</p>
                        <h1 className="text-lg font-semibold line-clamp-1">Home - Dirgandini, No 8</h1>
                    </div>
                </div>
                <ArrowForwardIos fontSize="medium" />
            </div>

            <div className="flex flex-col w-[90%] gap-5">
                <p>Payment Method</p>
                <div className="flex flex-col w-full">
                    <div className="flex w-full items-center justify-between border rounded-lg py-3 gap-[5%] px-[5%]">
                        <div className="flex items-center h-full gap-[10%]">
                            <Wallet fontSize="large" />
                            <h1 className="font-semibold">Transfer</h1>
                        </div>
                        <ArrowForwardIos fontSize="medium" />
                    </div>
                </div>

                <UploadForm />
            </div>
        </div>
    </div>
}