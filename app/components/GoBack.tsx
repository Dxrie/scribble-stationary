"use client";
import {useRouter} from "next/navigation";
import {ArrowLeft} from "lucide-react";

const GoBack = ({className}: {className: string | undefined}) => {
    const router = useRouter();

    return <div onClick={() => router.back()} className={className}><ArrowLeft/></div>
}

export default GoBack;