"use client";

import { z } from "zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Key, Loader2, AlertCircle } from "lucide-react";
import {
  useAuthState,
  useUpdateProfile,
  useDeleteUser,
} from "react-firebase-hooks/auth";
import { clientAuth } from "@/lib/firebase/firebase-client";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { PasswordResetDialog } from "@/components/dialog/passwod-reset";

const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .optional()
    .or(z.literal("")),
});

export default function ProfileContent() {
  const [user] = useAuthState(clientAuth);
  const [updateProfile, updatingProfile, profileError] =
    useUpdateProfile(clientAuth);
  const [deleteUser, deletingUser, deleteError] = useDeleteUser(clientAuth);
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("/avatar.png");
  const [isLoading, setIsLoading] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.displayName || "");
      setEmail(user.email || "");
      setImagePreview(user.photoURL || "/avatar.png");
    }
  }, [user]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = formSchema.safeParse({ username });
    if (!result.success) {
      setError(result.error.errors[0].message);
      setIsLoading(false);
      return;
    }

    try {
      if (username !== user?.displayName) {
        const success = await updateProfile({ displayName: username });
        if (!success) {
          throw new Error("Failed to update username");
        }
      }

      toast.success("Profile updated successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update profile. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const success = await deleteUser();
      if (success) {
        router.push("/auth/sign-in");
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account. Please try again.");
    }
  };

  if (profileError || deleteError) {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-red-500">Failed to Delete User</p>
          <p className="text-red-500">
            Error: {(profileError || deleteError)?.message}
          </p>
          <Button
            variant="outline"
            onClick={handleDeleteAccount}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-30px)] bg-background relative">
      {(updatingProfile || deletingUser) && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-50 flex items-center justify-center">
          <div className="text-muted-foreground">
            <Loader2 className="animate-spin" />
          </div>
        </div>
      )}
      {/* Header with Profile Picture */}
      <div className="relative h-32 bg-gradient-to-r from-red-500/30 via-yellow-500/30 via-green-500/30 via-blue-500/30 via-indigo-500/30 to-purple-500/30">
        <div className="absolute top-2 left-4 right-4 md:right-auto md:top-8">
          <div className="relative">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Settings
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Manage your account settings and update profile information.
            </p>
          </div>
        </div>
        <div className="absolute -bottom-12  left-1/2 transform -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0">
          <div className="relative">
            <Avatar className="w-24 h-24 rounded-full border-4 border-background shadow-lg">
              <AvatarImage src={imagePreview} alt="User avatar" />
              <AvatarFallback className="text-3xl font-medium bg-muted">
                {username.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-8 pt-16 md:pt-6 pb-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-center md:text-left mt-4 md:mt-0">
              <h2 className="text-2xl font-semibold tracking-tight">
                {username || "Set your display name"}
              </h2>
              <Badge
                variant="secondary"
                className="mt-2 text-sm font-medium px-3 py-1 inline-flex items-center bg-gradient-to-r from-red-500/30 via-yellow-500/30 via-green-500/30 via-blue-500/30 via-indigo-500/30 to-purple-500/30"
              >
                <Mail className="w-3 h-3 mr-1" />
                <span className="truncate max-w-[200px]">{email}</span>
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResetDialog(true)}
              className="gap-2 w-full md:w-auto mt-5 md:mt-10"
            >
              <Key className="w-4 h-4" />
              Change Password
            </Button>
          </div>

          <Card className="border shadow-sm mb-10">
            <CardContent className="pt-6">
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="username"
                      className="flex items-center gap-2 text-sm font-medium mb-2"
                    >
                      <User className="w-4 h-4" />
                      Display Name
                    </label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your display name"
                      className={error ? "border-red-500" : ""}
                    />
                    {error ? (
                      <p className="mt-2 text-sm text-red-500">{error}</p>
                    ) : (
                      <p className="mt-2 text-sm text-muted-foreground">
                        This is your public display name. It should be at least
                        2 characters long.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4 ">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                        disabled={isLoading}
                      >
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="py-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="delete-confirm"
                            className="text-sm font-medium"
                          >
                            To verify, type "delete my account" below:
                          </label>
                          <p className="text-xs text-muted-foreground">
                            Account to be deleted: {email}
                          </p>
                          <Input
                            id="delete-confirm"
                            value={deleteConfirmation}
                            onChange={(e) =>
                              setDeleteConfirmation(e.target.value)
                            }
                            className="w-full"
                          />
                        </div>
                      </div>
                      <AlertDialogFooter className="flex-col sm:flex-row !justify-between">
                        <AlertDialogCancel className="w-full sm:w-auto">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="w-full sm:w-auto"
                          disabled={deleteConfirmation !== "delete my account"}
                        >
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button
                    type="submit"
                    disabled={isLoading || username === user?.displayName}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <PasswordResetDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        defaultEmail={email}
      ></PasswordResetDialog>
    </div>
  );
}
