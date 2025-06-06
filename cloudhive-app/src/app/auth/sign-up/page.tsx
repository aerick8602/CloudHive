"use client";

import { SignUpForm } from "@/components/sign-up-form";
import { IconCloudCode } from "@tabler/icons-react";
import Link from "next/link";

export default function SignUp() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex flex-col items-start gap-1 font-medium">
            <div className="flex items-center gap-2 ml-12 lg:ml-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <IconCloudCode className="size-6" />
              </div>
              <span className="text-lg  font-semibold">CloudHive</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Unify. Simplify. Amplify your storage.
            </div>
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignUpForm />
          </div>
        </div>
        <div className="text-balance text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/background/Uploading-bro.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-70 dark:contrast-150"
        />
      </div>
    </div>
  );
}
