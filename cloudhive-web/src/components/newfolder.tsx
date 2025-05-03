"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthState } from "react-firebase-hooks/auth";
import { clientAuth } from "@/lib/firebase/firebase-client";

interface NewFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeEmail: string | undefined;
  currentParendId: string | undefined;
}

export function NewFolderDialog({
  open,
  onOpenChange,
  activeEmail,
  currentParendId,
}: NewFolderDialogProps) {
  const [folderName, setFolderName] = React.useState("Untitled Folder");
  const [isCreating, setIsCreating] = React.useState(false);
  const [user] = useAuthState(clientAuth);

  const createFolder = async () => {
    if (!activeEmail) return;
    setIsCreating(true);
    try {
      const res = await fetch("/api/new/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: activeEmail,
          newFolderName: folderName,
          currentParentId: currentParendId,
          userAppEmail: user!.email,
        }),
      });

      if (!res.ok) throw new Error("Folder creation failed.");
    } catch (err) {
      console.error("Error creating folder:", err);
    } finally {
      setIsCreating(false);
      onOpenChange(false); // Close dialog on success
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-70 lg:top-88">
        <DialogHeader>
          <DialogTitle>New Folder</DialogTitle>
          <DialogDescription>Create a new folder easily.</DialogDescription>
        </DialogHeader>
        <div className="flex-col items-center gap-2">
          <Input
            id="folder-name"
            placeholder="My new folder"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="flex-1"
          />
        </div>
        <DialogFooter className="mt-4 w-full">
          <div className="w-full flex justify-between">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={createFolder} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
