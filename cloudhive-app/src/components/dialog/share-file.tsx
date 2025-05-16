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
import { toast } from "sonner";
import { motion } from "framer-motion";
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
import { EarthIcon, UserCheck2, Crown } from "lucide-react";
import { CopyWithTick } from "../copy-tick";
import { FileData } from "@/interface";
import axios from "axios";

type Permission = "Can edit" | "Can view";

type Person = {
  displayName?: string;
  email: string;
  permission: Permission;
  photoLink?: string | null;
  permissionId: string;
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
  const [owner, setOwner] = useState<Person | null>(null);
  const [openSelect, setOpenSelect] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newPermission, setNewPermission] = useState<Permission>("Can view");
  const [selectedTab, setSelectedTab] = useState<"people" | "public">("people");
  const [isLoading, setIsLoading] = useState(false);

  const isEmailInputFilled = newEmail.trim().length > 0;
  const fileLink = `https://drive.google.com/file/d/${file.id}/view`;

  useEffect(() => {
    if (!file.permissions) return;

    const hasAnyoneWithLink = file.permissions.some(
      (p) => p.id === "anyoneWithLink"
    );
    setSelectedTab(hasAnyoneWithLink ? "public" : "people");

    const extractedPeople: Person[] = file.permissions
      .filter(
        (p) => p.type === "user" && p.role !== "owner" && !!p.emailAddress
      )
      .map((p) => ({
        displayName: p.displayName ?? undefined,
        email: p.emailAddress!,
        permission: p.role === "reader" ? "Can view" : "Can edit",
        photoLink: p.photoLink ?? undefined,
        permissionId: p.id,
      }));

    const ownerPermission = file.permissions.find(
      (p) => p.role === "owner" && p.type === "user"
    );
    if (ownerPermission && ownerPermission.emailAddress) {
      setOwner({
        displayName: ownerPermission.displayName ?? undefined,
        email: ownerPermission.emailAddress,
        permission: "Can edit",
        photoLink: ownerPermission.photoLink ?? undefined,
        permissionId: ownerPermission.id,
      });
    }

    setPeople(extractedPeople);
  }, [file.permissions]);

  const handleAddPerson = async () => {
    const trimmed = newEmail.trim();
    if (!trimmed || people.some((p) => p.email === trimmed)) return;

    try {
      setIsLoading(true);
      const role = newPermission === "Can view" ? "reader" : "writer";

      const response = await axios.post(
        `/api/file/${file.email}/permissions/${file.id}`,
        {
          type: "user",
          role,
          emailAddress: trimmed,
        }
      );

      // Only update state after successful API call
      setPeople((prev) => [
        ...prev,
        {
          email: trimmed,
          permission: newPermission,
          permissionId: response.data.result.id,
          displayName: response.data.result.displayName,
          photoLink: response.data.result.photoLink,
        },
      ]);

      setNewEmail("");
      setNewPermission("Can view");
      setOpenSelect(null);
    } catch (error) {
      toast.warning("Unable to complete the request. Please try again.", {
        position: "top-center",
      });

      console.error("Failed to add permission", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionChange = async (
    permissionId: string,
    newPerm: string
  ) => {
    try {
      setIsLoading(true);

      if (newPerm === "Remove access") {
        await axios.delete(`/api/file/${file.email}/permissions/${file.id}`, {
          data: { permissionId },
        });
        // Only remove after successful API call
        setPeople((prev) =>
          prev.filter((p) => p.permissionId !== permissionId)
        );
      } else {
        const role = newPerm === "Can view" ? "reader" : "writer";

        await axios.patch(`/api/file/${file.email}/permissions/${file.id}`, {
          permissionId,
          role,
        });

        // Only update after successful API call
        setPeople((prev) =>
          prev.map((p) =>
            p.permissionId === permissionId
              ? { ...p, permission: newPerm as Permission }
              : p
          )
        );
      }

      setOpenSelect(null);
    } catch (error) {
      toast.warning("Unable to complete the request. Please try again.", {
        position: "top-center",
      });

      console.error("Failed to update/remove permission", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneralAccess = async (val: string) => {
    if (selectedTab === val) return;

    setIsLoading(true);
    const previousTab = selectedTab;

    try {
      if (val === "public") {
        // Create public permission
        setSelectedTab("public");
        const response = await axios.post(
          `/api/file/${file.email}/permissions/${file.id}`,
          {
            type: "anyone",
            role: "reader",
          }
        );

        // Update state only after successful API call
      } else {
        // Find and remove the public permission
        setSelectedTab("people");
        const publicPermission = file.permissions?.find(
          (p) => p.id === "anyoneWithLink" || p.type === "anyone"
        );

        if (publicPermission) {
          await axios.delete(`/api/file/${file.email}/permissions/${file.id}`, {
            data: { permissionId: publicPermission.id },
          });
        }

        // Update state only after successful API call
      }
    } catch (error) {
      // Revert to previous tab if API call fails
      toast.warning("Unable to complete the request. Please try again.", {
        position: "top-center",
      });

      setSelectedTab(previousTab);
      console.error("Error updating public access:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDisplayName = (displayName?: string, email?: string) => {
    if (displayName && displayName.trim().length > 0) return displayName;
    if (!email) return "";
    return email.split("@")[0].replace(/\./g, " ");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden  w-full max-w-sm sm:max-w-lg px-4 sm:px-6">
        {isLoading && (
          <>
            {/* Loading bar */}
            <motion.div
              className="absolute top-0 left-0 h-1 bg-primary w-full origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                repeat: Infinity,
                duration: 1,
                ease: "linear",
              }}
            />
            {/* Overlay to block interactions */}
            <div className="absolute inset-0 bg-background/50 z-10 " />
          </>
        )}

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

        {owner && (
          <div className="flex items-center justify-between gap-4 text-muted-foreground -mb-1">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={owner.photoLink ?? ""} alt={owner.email} />
                <AvatarFallback>{owner.email[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <div className="text-sm font-medium text-foreground">
                  {getDisplayName(owner.displayName, owner.email)}
                </div>
                <div className="text-xs truncate max-w-[200px]">
                  {owner.email}
                </div>
              </div>
            </div>

            <div className="w-[110px] px-3 py-1.5 border border-input rounded-md text-sm bg-muted/50 text-muted-foreground flex items-center gap-1 justify-center select-none cursor-default">
              <Crown className="w-4 h-4" />
              Owner
            </div>
          </div>
        )}

        <Tabs value={selectedTab} onValueChange={handleGeneralAccess}>
          <TabsList className="grid w-full grid-cols-2 mt-2">
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
                id="email"
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
                  <SelectTrigger className="w-[110px] mr-1">
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
                    key={person.permissionId}
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
                        handlePermissionChange(person.permissionId, val)
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
