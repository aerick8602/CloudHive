"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LogoutRedirect() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await axios.post("/api/auth/logout");
      router.replace("/auth/sign-in");
    };

    logout();
  }, []);

  return null;
}
