"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import RotatingText from "@/components/reactbits/RotatingText/RotatingText";
import { toast } from "sonner";
import { Toaster } from "sonner";
export default function Auth() {
  const router = useRouter();
  const [otp, setOtp] = useState("");

  const handleChange = (value: string) => {
    setOtp(value);

    if (value.length === 6 && value !== process.env.NEXT_PUBLIC_PASSWORD) {
      toast.error("Incorrect password. Please try again.");
    }

    if (value.length === 6 && value === process.env.NEXT_PUBLIC_PASSWORD) {
      const expiresAt = Date.now() + 1000 * 60 * 60; // 60 minutes
      const authData = { value: true, expiresAt };
      localStorage.setItem("authenticated", JSON.stringify(authData));
      document.cookie = `authenticated=true; path=/; max-age=1800`;
      router.replace("/");
    }
  };

  return (
    <div className="h-screen">
      <Toaster position="top-right" />
      <div className="h-9 lg:h-12 w-screen fixed top-0 bg-gradient-to-r from-[#EA4355] via-[#4285F4] to-[#34A853] text-white font-semibold text-sm lg:text-lg flex justify-center items-center gap-3">
        <div className="text-center">
          Power Up Your Cloud Storage with CloudHive&apos;s Smart Sync
        </div>
      </div>

      <div className="flex flex-col items-center justify-center h-[60vh] lg:h-[80vh] px-4 pt-16 lg:pt-24">
        <img
          className="w-40 mb-2"
          src="icon/Google_Cloud.png"
          alt="Google Cloud Logo"
        />

        <div className="flex flex-row gap-2 text-3xl sm:text-4xl font-bold mb-4 lg:mb-8">
          <div className="mt-1">Cloud</div>
          <RotatingText
            texts={["Hive", "Stack", "Sync", "Box"]}
            mainClassName="px-3 py-1 bg-cyan-300 text-black rounded-lg shadow-md"
            staggerFrom="last"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            staggerDuration={0.05}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
        </div>

        <InputOTP
          maxLength={6}
          value={otp}
          onChange={handleChange}
          className="mb-4"
        >
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTP>

        <div className="text-xs lg:text-base text-muted-foreground mt-4">
          Enter password to authenticate and access CloudHive's features.
        </div>
      </div>
    </div>
  );
}
