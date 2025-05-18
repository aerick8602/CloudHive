"use client";

import { z } from "zod";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

const formSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: "Username must be at least 2 characters." })
      .optional()
      .or(z.literal("")),
    email: z
      .string()
      .email({ message: "Please enter a valid email." })
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." })
      .optional()
      .or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.password) {
        return data.password === data.confirmPassword;
      }
      return true; // no password => no need to check confirmPassword
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export default function ProfileContent() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("/avatar.png");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // ref for hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview("/avatar.png");
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = formSchema.safeParse({
      username,
      email,
      password,
      confirmPassword,
    });
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
      console.log("Image file:", imageFile);
      // Upload logic here
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col overflow-auto max-h-[calc(100vh-50px)]">
      {/* Header */}
      <div className="space-y-0.5 px-4 py-6 flex-shrink-0">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and update profile information.
        </p>
      </div>
      <Separator className="shadow-sm" />

      {/* Scrollable main content */}
      <div className="flex flex-1 overflow-auto flex-col lg:flex-row">
        <div className="flex flex-col lg:flex-row flex-1 max-w-8xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 gap-8 overflow-auto">
          {/* Sidebar with Avatar and upload */}
          <aside className="flex flex-col items-center lg:items-center justify-center lg:justify-start space-y-0 w-full lg:w-1/3 flex-shrink-0 overflow-auto px-4">
            <div className="relative w-50 h-50 sm:w-58 sm:h-58 lg:w-66 lg:h-66">
              <Avatar className="w-full h-full rounded-lg">
                <AvatarImage src={imagePreview} alt="User avatar" />
                <AvatarFallback className="w-full h-full rounded-lg">
                  U
                </AvatarFallback>
              </Avatar>
              {/* Upload button overlay */}
              <button
                type="button"
                onClick={handleUploadClick}
                className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Upload profile picture"
              >
                <Camera className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </aside>

          {/* Form area */}
          <main className="lg:ml-2 pl-2 flex-1  pb-12">
            <form
              onSubmit={onSubmit}
              className="space-y-4 max-w-xl mx-auto lg:mx-0"
            >
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  className={`block w-full rounded-md border px-3 py-2 text-sm shadow-sm
                    focus:ring-2 focus:ring-blue-500 focus:outline-none
                    ${errors.username ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.username ? (
                  <p className="mt-1 text-xs text-red-600">{errors.username}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">
                    This is your public display name. You can only change this
                    once every 30 days.
                  </p>
                )}
              </div>

              {/* Email */}
              {/* <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`block w-full rounded-md border px-3 py-2 text-sm shadow-sm
                    focus:ring-2 focus:ring-blue-500 focus:outline-none
                    ${errors.email ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.email ? (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">
                    You can manage verified email addresses in your{" "}
                    <a
                      href="/"
                      className="underline hover:text-blue-600"
                      target="_blank"
                      rel="noreferrer"
                    >
                      email settings
                    </a>
                    .
                  </p>
                )}
              </div> */}

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1"
                >
                  Reset Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className={`block w-full rounded-md border px-3 py-2 text-sm shadow-sm
                    focus:ring-2 focus:ring-blue-500 focus:outline-none
                    ${errors.password ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.password ? (
                  <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">
                    Choose a strong password with at least 6 characters.
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-1"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="********"
                  className={`block w-full rounded-md border px-3 py-2 text-sm shadow-sm
                    focus:ring-2 focus:ring-blue-500 focus:outline-none
                    ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full sm:w-auto !mb-5">
                Update Profile
              </Button>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}
