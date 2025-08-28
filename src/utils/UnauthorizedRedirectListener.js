// components/UnauthorizedRedirectListener.js
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const UnauthorizedRedirectListener = () => {
  const router = useRouter();

  useEffect(() => {
    const handleUnauthorized = () => {
      console.log("Run")
      router.push("/admin/adminLogin");
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    return () => window.removeEventListener("unauthorized", handleUnauthorized);
  }, [router]);

  return null;
};

export default UnauthorizedRedirectListener;
