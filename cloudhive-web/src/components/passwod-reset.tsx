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
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";

import { toast } from "sonner";
import { clientAuth } from "@/lib/firebase/firebase-client";

export const PasswordResetDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [email, setEmail] = useState("");

  const handlePasswordReset = async () => {
    const actionCodeSettings = {
      url: "http://localhost:3000/auth/sign-in",
      handleCodeInApp: true,
    };
    try {
      await sendPasswordResetEmail(clientAuth, email, actionCodeSettings);
      toast.success(
        "A password reset link has been sent to your email address.",
        {
          position: "top-right",
        }
      );
      onOpenChange(false);
    } catch (err: any) {
      toast.error("Failed to send reset email.", {
        position: "top-right",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-70 lg:top-88">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Please enter the email address associated with your account to reset
            your password.
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
            <Button
              className="cursor-pointer w-full"
              onClick={handlePasswordReset}
            >
              Continue
            </Button>
          </DialogClose>
          {/* <div className="w-full flex justify-between">
            <DialogClose asChild>
              <Button className="cursor-pointer" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button className="cursor-pointer" onClick={handlePasswordReset}>
                Send
              </Button>
            </DialogClose>
          </div> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
