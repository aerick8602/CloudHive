import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  browserLocalPersistence,
  setPersistence,
  signOut,
} from "firebase/auth";
import { clientAuth } from "@/lib/firebase/firebase-client";
import { getFirebaseErrorMessage } from "@/lib/firebase/firebase-error";
import { PasswordResetDialog } from "./dialog/passwod-reset";

export function SignInForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const router = useRouter();

  const [
    signInWithEmailAndPassword,
    user,
    loading,
    signInWithEmailAndPasswordError,
  ] = useSignInWithEmailAndPassword(clientAuth);

  const [signInWithGoogle, , , googleSignInError] =
    useSignInWithGoogle(clientAuth);

  const handleEmailAndPasswordSignIn = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      await setPersistence(clientAuth, browserLocalPersistence);
      const result = await signInWithEmailAndPassword(email, password);

      if (!result?.user) return; // if no user, just return, error toast will show via useEffect
      if (!result.user.emailVerified) {
        // Email not verified
        toast.error("Please verify your email before signing in.", {
          position: "top-right",
        });
        await signOut(clientAuth); // Sign out the user to enforce the verification check
        return;
      }
      const idToken = await result.user.getIdToken();

      const redirectingToastId = toast.loading("Setting up your session...", {
        position: "top-right",
      });

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        toast.success("Signed in successfully.", {
          id: redirectingToastId,
          position: "top-right",
        });
        router.push("/");
      } else {
        toast.error("Failed to set session cookie.", {
          id: redirectingToastId,
          position: "top-right",
        });
      }
    } catch (err) {
      console.error("Error during email/password sign-in:", err);
      toast.error("An unexpected error occurred. Please try again.", {
        position: "top-right",
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await setPersistence(clientAuth, browserLocalPersistence);
      const result = await signInWithGoogle();

      if (!result?.user) return; // if no user, exit, error handled by hooks if any

      const idToken = await result.user.getIdToken();

      const redirectingToastId = toast.loading("Setting up your session...", {
        position: "top-right",
      });

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        toast.success("Signed in successfully.", {
          id: redirectingToastId,
          position: "top-right",
        });
        router.push("/");
      } else {
        toast.error("Failed to set session cookie.", {
          id: redirectingToastId,
          position: "top-right",
        });
      }
    } catch (err) {
      console.error("Error during Google sign-in:", err);
      toast.error("Sign-in failed. Please try again later.", {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    if (signInWithEmailAndPasswordError) {
      console.error(
        "Firebase sign-in error:",
        signInWithEmailAndPasswordError.code
      );
      const msg = getFirebaseErrorMessage(signInWithEmailAndPasswordError.code);
      toast.error(msg, {
        position: "top-right",
      });
    }
  }, [signInWithEmailAndPasswordError]);

  useEffect(() => {
    if (googleSignInError) {
      console.error("Google sign-in error:", googleSignInError.code);
      const msg = getFirebaseErrorMessage(googleSignInError.code);
      toast.error(msg, {
        position: "top-right",
      });
    }
  }, [googleSignInError]);

  return (
    <>
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={handleEmailAndPasswordSignIn}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/sign-up" className="underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="ayush@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                onClick={() => setOpenResetDialog(true)}
                className="ml-auto text-sm underline-offset-4 hover:underline text-primary"
              >
                Forgot your password?
              </button>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Login with Google
          </Button>
        </div>
      </form>
      <PasswordResetDialog
        open={openResetDialog}
        onOpenChange={setOpenResetDialog}
      />
    </>
  );
}
