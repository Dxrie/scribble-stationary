"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Transition from "./components/Transition";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <Transition>
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-background">
        {/* Title */}
        <h1 className="text-6xl font-bold text-black mb-4">404</h1>

        {/* Subtitle */}
        <h2 className="text-2xl font-semibold text-gray-950 mb-4">
          Oops! Page Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-900 mb-8 max-w-md">
          The page you{"'"}re looking for doesn{"'"}t exist or has been moved.
          Please check the URL or go back to the homepage.
        </p>

        {/* Back to Home Button */}
        <div className="flex space-x-4">
          <button
            onClick={() => router.back()}
            className="bg-gray-950 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition duration-300"
          >
            Go Back
          </button>
          <Link
            href="/"
            className="bg-[#264653] text-white px-6 py-2 rounded-lg hover:bg-[#355070] transition duration-300"
          >
            Return Home
          </Link>
        </div>
      </div>
    </Transition>
  );
}
