import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";

import {
  browserLocalPersistence,
  sendPasswordResetEmail,
  setPersistence,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { getFirebaseErrorMessage } from "@/lib/firebase/error";
import { PasswordResetDialog } from "./passwod-reset";
import { clientAuth } from "@/lib/firebase/firebase-client";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const router = useRouter();

  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(clientAuth);
  const handleEmailAndPasswordSignUp = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      await setPersistence(clientAuth, browserLocalPersistence);
      const result = await createUserWithEmailAndPassword(email, password);

      if (result?.user) {
        const idToken = await result.user.getIdToken();
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        });

        if (response.ok) {
          toast.success("Sign-up successful. Redirecting to your drive...", {
            position: "top-right",
          });
          router.push("/");
        } else {
          throw new Error("Failed to set session cookie");
        }
      } else {
        toast.error("Failed to sign up. Please try again.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      toast.error("An error occurred during sign-up. Please try again.", {
        position: "top-right",
      });
    }
  };

  const [signInWithGoogle] = useSignInWithGoogle(clientAuth);
  const handleGoogleSignIn = async () => {
    try {
      await setPersistence(clientAuth, browserLocalPersistence);
      const result = await signInWithGoogle();

      if (result?.user) {
        const idToken = await result.user.getIdToken();
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });

        if (response.ok) {
          toast.success("Login successful. Redirecting to your drive...", {
            position: "top-right",
          });
          router.push("/");
        } else {
          throw new Error("Failed to set session cookie");
        }
      } else {
        toast.error("Google sign-in failed. Please try again.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      toast.error(
        "An error occurred during Google sign-in. Please try again.",
        { position: "top-right" }
      );
    }
  };

  useEffect(() => {
    if (error) {
      console.log(error.code);
      const msg = getFirebaseErrorMessage(error.code);
      toast.error(msg, {
        position: "top-right",
      });
    }
  }, [error]);

  return (
    <>
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={handleEmailAndPasswordSignUp}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="underline underline-offset-4">
              Log in
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
            Sign Up
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
