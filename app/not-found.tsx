"use client";
import Link from "next/link";
import {useRouter} from "next/navigation";
import Transition from "./components/Transition";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <Transition>
      <div
        className="flex flex-col items-center justify-center min-h-screen text-center p-4"
        style={{backgroundColor: "#264653"}}
      >
        {/* Title */}
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>

        {/* Subtitle */}
        <h2 className="text-2xl font-semibold text-gray-200 mb-4">
          Oops! Page Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-300 mb-8 max-w-md">
          The page you{"'"}re looking for doesn{"'"}t exist or has been moved. Please
          check the URL or go back to the homepage.
        </p>

        {/* Back to Home Button */}
        <div className="flex space-x-4">
          <button
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition duration-300"
          >
            Go Back
          </button>
          <Link
            href="/"
            className="bg-[#2A9D8F] text-white px-6 py-2 rounded-lg hover:bg-[#21867A] transition duration-300"
          >
            Return Home
          </Link>
        </div>
      </div>
    </Transition>
  );
}
