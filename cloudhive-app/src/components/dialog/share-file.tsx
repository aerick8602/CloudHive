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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useEffect, useState } from "react";
import { EarthIcon, UserCheck2 } from "lucide-react";
import { CopyWithTick } from "../copy-tick";
import { FileData } from "@/interface";

type Permission = "Can edit" | "Can view";

type Person = {
  displayName?: string;
  email: string;
  permission: Permission;
  photoLink?: string | null;
};

interface ShareDialogProps {
  file: FileData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  file,
  open,
  onOpenChange,
}) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [openSelect, setOpenSelect] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newPermission, setNewPermission] = useState<Permission>("Can view");
  const [selectedTab, setSelectedTab] = useState<"people" | "public">("people");

  const isEmailInputFilled = newEmail.trim().length > 0;
  const fileLink = `https://drive.google.com/file/d/${file.id}/view`;

  // Populate initial people from file.permissions
  useEffect(() => {
    if (!file.permissions) return;

    // Check if permission for "anyonewithlink" exists
    const hasAnyoneWithLink = file.permissions.some(
      (p) => p.id === "anyonewithlink"
    );

    setSelectedTab(hasAnyoneWithLink ? "public" : "people");

    const existingPeople: Person[] = file.permissions
      .filter((p) => p.type === "user" && p.role !== "owner" && p.emailAddress)
      .map((p) => ({
        displayName: p.displayName ?? undefined,
        email: p.emailAddress!,
        permission: p.role === "reader" ? "Can view" : "Can edit",
        photoLink: p.photoLink ?? undefined,
      }));

    setPeople(existingPeople);
  }, [file.permissions]);

  const handleAddPerson = () => {
    const trimmed = newEmail.trim();
    if (!trimmed || people.some((p) => p.email === trimmed)) return;

    setPeople([
      ...people,
      { email: trimmed, permission: newPermission, photoLink: undefined },
    ]);
    setNewEmail("");
    setNewPermission("Can view");
    setOpenSelect(null);
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

  const getDisplayName = (displayName?: string, email?: string) => {
    if (displayName && displayName.trim().length > 0) return displayName;
    if (!email) return "";
    return email.split("@")[0].replace(/\./g, " ");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-sm sm:max-w-lg px-4 sm:px-6">
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
            <Input id="link" value={fileLink} readOnly />
          </div>
          <Button
            type="button"
            size="sm"
            className="px-3"
            aria-label="Copy link"
          >
            <CopyWithTick value={fileLink} />
          </Button>
        </div>

        <Separator />

        <Tabs
          value={selectedTab}
          onValueChange={(val) => setSelectedTab(val as "people" | "public")}
          defaultValue="people"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="people">Invited people only</TabsTrigger>
            <TabsTrigger value="public">People with the link</TabsTrigger>
          </TabsList>

          <TabsContent value="people" className="pt-4">
            <div className="flex flex-row sm:flex-row gap-2 sm:items-center mb-4">
              <Input
                placeholder="Enter email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="flex-1"
                type="email"
                aria-label="Enter email to share"
              />
              {isEmailInputFilled && (
                <Select
                  value={newPermission}
                  open={openSelect === "new"}
                  onOpenChange={(isOpen) =>
                    setOpenSelect(isOpen ? "new" : null)
                  }
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
              )}
            </div>

            {people.length === 0 ? (
              <div className="text-sm pt-4 text-muted-foreground/90 flex items-center justify-center gap-1">
                <UserCheck2 className="size-4" />
                No one&apos;s been invited yet — add an email above to get
                started.
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-48 pr-1">
                {people.map((person) => (
                  <div
                    key={person.email}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <Avatar>
                        <AvatarImage
                          src={person.photoLink ?? ""}
                          alt={person.email}
                        />
                        <AvatarFallback>
                          {person.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm truncate max-w-[180px] sm:max-w-[250px]">
                          {getDisplayName(person.displayName, person.email)}
                        </div>
                        <div className="text-xs truncate max-w-[180px] sm:max-w-[250px]">
                          {person.email}
                        </div>
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
            <EarthIcon className="size-4" />
            This content is publicly available to all via link.
          </TabsContent>
        </Tabs>

        <DialogFooter className="sm:justify-between mt-4">
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleAddPerson}
            disabled={!isEmailInputFilled}
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
