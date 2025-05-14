"use client";

import { z } from "zod";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import * as SelectPrimitive from "@radix-ui/react-select";

const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email({ message: "Please select a valid email." }),
  bio: z.string().optional(),
});

export default function SettingAccounts() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = formSchema.safeParse({ username, email, bio });
    if (!result.success) {
      const fieldErrors: Record<string, string | undefined> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
      console.log("Submitted data:", result.data);
    }
  };

  return (
    <div>
      <div className="space-y-0.5 px-4 py-6">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator className="shadow-sm" />
      <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12">
        <aside className="top-0 lg:sticky lg:w-1/5">
          {/* Sidebar if needed */}
        </aside>
        <div className="overflow-y-auto py-6 max-h-[calc(100vh-12rem)] flex w-full overflow-y-auto px-4">
          <form onSubmit={onSubmit} className="space-y-8 w-full">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="shadcn"
                className="block w-full px-3 py-2 border rounded"
              />
              <p className="text-sm text-red-500">{errors.username}</p>
              <p className="text-sm text-gray-500">
                This is your public display name. You can only change this once
                every 30 days.
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <SelectPrimitive.Root value={email} onValueChange={setEmail}>
                <div className="relative">
                  <SelectPrimitive.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 border rounded">
                    <SelectPrimitive.Value placeholder="Select a verified email to display" />
                    <SelectPrimitive.Icon>
                      <ChevronDown className="w-4 h-4" />
                    </SelectPrimitive.Icon>
                  </SelectPrimitive.Trigger>
                  <SelectPrimitive.Portal>
                    <SelectPrimitive.Content className="bg-white border shadow">
                      <SelectPrimitive.Item
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                        value="user@example.com"
                      >
                        user@example.com
                      </SelectPrimitive.Item>
                      <SelectPrimitive.Item
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                        value="other@example.com"
                      >
                        other@example.com
                      </SelectPrimitive.Item>
                    </SelectPrimitive.Content>
                  </SelectPrimitive.Portal>
                </div>
              </SelectPrimitive.Root>
              <p className="text-sm text-red-500">{errors.email}</p>
              <p className="text-sm text-gray-500">
                You can manage verified email addresses in your{" "}
                <Link href="/" className="underline">
                  email settings
                </Link>
                .
              </p>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a little about yourself"
                className="block w-full px-3 py-2 border rounded"
              />
              <p className="text-sm text-red-500">{errors.bio}</p>
            </div>

            {/* Submit */}
            <Button type="submit">Update profile</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
