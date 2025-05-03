"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useState, useEffect } from "react";

interface RenameFolderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderName: string;
  setFolderName: (name: string) => void;
}

export const RenameFolderDialog: React.FC<RenameFolderProps> = ({
  open,
  onOpenChange,
  folderName,
  setFolderName,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-70 lg:top-88">
        <DialogHeader>
          <DialogTitle>Rename</DialogTitle>
          <DialogDescription>
            Give a new name to your file or folder.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="New name"
        />
        <DialogFooter className="mt-4 w-full">
          <div className="w-full flex justify-between">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                console.log("Folder name chnaged");
              }}
            >
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RenameFolderDialog;
