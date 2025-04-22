"use client";

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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyWithTick } from "./copy-tick";
import { useState } from "react";
import { EarthIcon, UserCheck2 } from "lucide-react";

type Permission = "Can edit" | "Can view";
type Person = {
  email: string;
  permission: Permission;
};

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [people, setPeople] = useState<Person[]>([
    { email: "katiyara089@gmail.com", permission: "Can edit" },
    { email: "clashofclans@gmail.com", permission: "Can view" },
    { email: "maverick@gmail.com", permission: "Can view" },
    { email: "maerick@gmail.com", permission: "Can view" },
    { email: "maverck@gmail.com", permission: "Can view" },
    { email: "marick@gmail.com", permission: "Can view" },
  ]);

  const [openSelect, setOpenSelect] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newPermission, setNewPermission] = useState<Permission>("Can view");

  const handleAddPerson = () => {
    const trimmed = newEmail.trim();
    if (!trimmed || people.some((p) => p.email === trimmed)) return;

    setPeople([...people, { email: trimmed, permission: newPermission }]);
    setNewEmail("");
    setNewPermission("Can view");
  };

  const handlePermissionChange = (email: string, newPerm: string) => {
    if (newPerm === "Remove access") {
      setPeople((prev) => prev.filter((p) => p.email !== email));
    } else {
      setPeople((prev) =>
        prev.map((p) =>
          p.email === email ? { ...p, permission: newPerm as Permission } : p
        )
      );
    }
  };

  const isEmailInputFilled = newEmail.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share this document</DialogTitle>
          <DialogDescription>
            Control who can see or edit this file with ease.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2">
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

        <Tabs defaultValue="people">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="people">Invited people only</TabsTrigger>
            <TabsTrigger value="public">People with the link</TabsTrigger>
          </TabsList>

          <TabsContent value="people" className="pt-4">
            {/* Add Email Form */}
            <div className="flex items-center gap-3 mb-4">
              <Input
                placeholder="Enter email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="flex-1"
              />
              <Select
                value={newPermission}
                onValueChange={(val: string) =>
                  setNewPermission(val as Permission)
                }
              >
                <SelectTrigger className="w-[110px] mr-2.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Can edit">Editor</SelectItem>
                  <SelectItem value="Can view">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* List of People */}
            {people.length === 0 ? (
              <div className="text-sm pt-4 text-muted-foreground/90 flex items-center justify-center gap-1">
                <UserCheck2 className="size-4"></UserCheck2>
                No one&apos;s been invited yet — add an email above to get
                started.
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-24 pr-1">
                {people.map((person) => (
                  <div
                    key={person.email}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {person.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm truncate max-w-[250px]">
                        {person.email}
                      </div>
                    </div>
                    <Select
                      value={person.permission}
                      open={openSelect === person.email}
                      onOpenChange={(isOpen) =>
                        setOpenSelect(isOpen ? person.email : null)
                      }
                      onValueChange={(val) =>
                        handlePermissionChange(person.email, val)
                      }
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Can edit">Editor</SelectItem>
                        <SelectItem value="Can view">Viewer</SelectItem>
                        <SelectItem value="Remove access">
                          Remove access
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="public"
            className="text-sm pt-4 pb-4 text-muted-foreground/90 flex items-center justify-center gap-1"
          >
            <EarthIcon className="size-4"></EarthIcon>
            This content is publicly available to anyone with the link.
          </TabsContent>
        </Tabs>

        <DialogFooter className="sm:justify-between ">
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              onClick={isEmailInputFilled ? handleAddPerson : undefined}
            >
              {isEmailInputFilled ? "Add" : "Save"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
