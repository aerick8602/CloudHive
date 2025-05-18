"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { BanIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UnauthorisedError() {
  const router = useRouter();
  const logout = async () => {
    await axios.post("/api/auth/logout");
    router.push("/auth/sign-in");
  };

  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] leading-tight font-bold">401</h1>
        <span className="font-medium">Unauthorized Access</span>
        <p className="text-muted-foreground text-center">
          Please log in with the appropriate credentials <br /> to access this
          resource.
        </p>

        <div className="mt-6 flex gap-4">
          <Button onClick={logout}>Login to Continue</Button>
        </div>
      </div>
    </div>
  );
}
