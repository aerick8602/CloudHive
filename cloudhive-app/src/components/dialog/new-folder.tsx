"use client";

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

interface NewFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderName: string;
  setFolderName: (name: string) => void;
  createFolder: () => void;
}

export const NewFolderDialog = ({
  open,
  onOpenChange,
  folderName,
  setFolderName,
  createFolder,
}: NewFolderDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-70 lg:top-88">
        <DialogHeader>
          <DialogTitle>New Folder</DialogTitle>
          <DialogDescription>
            Create your new folder in just one-click.
          </DialogDescription>
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
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={createFolder}>Create</Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
