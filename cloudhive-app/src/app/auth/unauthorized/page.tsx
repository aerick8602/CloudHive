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
        <span className="font-medium flex items-center justify-center gap-1">
          <BanIcon size={20} />
          Unauthorized Access
        </span>

        <p className="text-md text-muted-foreground text-center">
          The app is currently being tested and can only be accessed by
          <br />
          developer-approved testers. If you think you should have <br />{" "}
          access, contact the &nbsp;
          <b>developer.</b>&nbsp;
          <a
            href="mailto:katiyarayush02@gmail.com"
            className=" text-xs hover:underline"
          >
            (katiyarayush02@gmail.com)
          </a>
        </p>
        <div className="mt-6 flex gap-4">
          <Button onClick={logout}>Login to Continue</Button>
        </div>
      </div>
    </div>
  );
}
