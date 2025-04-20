import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CopyWithTick } from "./copy-tick";
import { useState } from "react";

const people = [
  {
    email: "katiyara089@gmail.com",

    permission: "Can edit",
  },
  {
    email: "clashofclans@gmail.com",
    permission: "Can view",
  },
  {
    email: "maverick@gmail.com",
    permission: "Can view",
  },
  {
    email: "ayushkatddddddddddddddddddddddddddddddiyar@gmail.com",
    permission: "Can view",
  },
  {
    email: "p@eample.com",
    permission: "Can view",
  },
  {
    email: "katyara089@gmail.com",

    permission: "Can edit",
  },
  {
    email: "clahofclans@gmail.com",
    permission: "Can view",
  },
  {
    email: "mavrick@gmail.com",
    permission: "Can view",
  },
];

export default function ShareDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}) {
  const [openSelect, setOpenSelect] = useState<string | null>(null);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" sm:max-w-lg   ">
        <DialogHeader>
          <DialogTitle>Share this document</DialogTitle>
          <DialogDescription>
            Anyone with the link can view this document.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue="http://example.com/link/to/document"
              readOnly
            />
          </div>
          <Button type="button" size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            <CopyWithTick value="http://example.com/link/to/document" />
          </Button>
        </div>

        <Separator />

        <div className="text-sm font-medium mb-2  ">People with access</div>
        <div className="space-y-3 lg:space-y-4 overflow-y-auto max-h-48">
          {people.map((person) => (
            <div
              key={person.email}
              className="flex items-center justify-between mr-1.5 lg:mr-5"
            >
              <div className="flex items-center space-x-1 lg:space-x-3 ">
                <Avatar>
                  <AvatarFallback>
                    {person.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-accent-foreground text-sm lg:text-base text-center h-full items-center justify-center pb-1 truncate max-w-[125px] lg:max-w-[250px] overflow-hidden whitespace-nowrap">
                  {person.email}
                </div>
              </div>
              <Select
                defaultValue={person.permission}
                open={openSelect === person.email}
                onOpenChange={(isOpen) => {
                  setOpenSelect(isOpen ? person.email : null);
                }}
              >
                <SelectTrigger className="w-[100px] lg:w-[105px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-accent-foreground text-sm">
                  <SelectItem className="cursor-pointer" value="Can edit">
                    Editor
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="Can view">
                    Viewer
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="Remove access">
                    Remove access
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <DialogFooter className="sm:justify-between pt-4 ">
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" className="cursor-pointer">
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
