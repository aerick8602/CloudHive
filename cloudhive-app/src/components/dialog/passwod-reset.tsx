"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { sendPasswordResetEmail } from "firebase/auth";

import { toast } from "sonner";
import { clientAuth } from "@/lib/firebase/firebase-client";

export const PasswordResetDialog = ({
  open,
  onOpenChange,
  defaultEmail = "",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultEmail?: string;
}) => {
  const [email, setEmail] = useState(defaultEmail);

  useEffect(() => {
    setEmail(defaultEmail);
  }, [defaultEmail]);

  const handlePasswordReset = async () => {
    const actionCodeSettings = {
      url: process.env.NEXT_PUBLIC_BASE_URL!,
      handleCodeInApp: true,
    };
    try {
      await sendPasswordResetEmail(clientAuth, email, actionCodeSettings);
      toast.success(
        "A reset link has been sent to your registered email.",
        {
          position: "top-right",
        }
      );
      onOpenChange(false);
    } catch (err: any) {
      toast.error("Failed to send reset email.", {
        position: defaultEmail?"bottom-right":"top-right",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-70 lg:top-88">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            {defaultEmail 
              ? "A password reset link will be sent to your email address."
              : "Please enter the email linked to your account to reset your password."}
          </DialogDescription>
        </DialogHeader>
        <div>
          <Input
            id="email"
            type="email"
            placeholder="ayush@gmail.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <DialogFooter className="mt-4 w-full">
          <DialogClose asChild>
            <Button className=" w-full" onClick={handlePasswordReset}>
              Continue
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
