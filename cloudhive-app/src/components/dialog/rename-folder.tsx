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
  fileName: string;
  onRenameSuccess?: (newName: string) => void; // new callback prop
}

export const RenameFolderDialog: React.FC<RenameFolderProps> = ({
  open,
  onOpenChange,
  fileName,
  onRenameSuccess,
}) => {
  const [newFilename, setNewFilename] = useState(fileName || "Untitled File");

  useEffect(() => {
    if (open) setNewFilename(fileName); // Reset input when dialog opens
  }, [open, fileName]);

  const handleSave = () => {
    if (!newFilename.trim()) {
      alert("Name cannot be empty");
      return;
    }
    if (newFilename === fileName) {
      // No change, just close
      onOpenChange(false);
      return;
    }
    // Call parent's rename handler
    onRenameSuccess?.(newFilename.trim());
    // Close dialog
    onOpenChange(false);
  };

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
          value={newFilename} // fix here: use newFilename state
          onChange={(e) => setNewFilename(e.target.value)}
          placeholder="New name"
          autoFocus
        />
        <DialogFooter className="mt-4 w-full">
          <div className="w-full flex justify-between">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RenameFolderDialog;
