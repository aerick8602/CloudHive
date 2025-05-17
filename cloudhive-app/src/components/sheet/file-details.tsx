"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FileData } from "@/interface";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getIconForMimeType } from "@/utils/icons";
import { Badge } from "@/components/ui/badge";
import { Thumbnail } from "../thumbnail";
import {
  FileText,
  Users,
  Info,
  Eye,
  Clock,
  User,
  Calendar,
  HardDrive,
  Lock,
  Star,
  Trash2,
  Download,
  Share2,
  Crown,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FileDetailsProps {
  file: FileData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FileDetailsSheet: React.FC<FileDetailsProps> = ({
  file,
  open,
  onOpenChange,
}) => {
  const { icon: Icon, color } = getIconForMimeType(file.mimeType);
  const isFolder = file.mimeType === "application/vnd.google-apps.folder";

  const formatDate = (dateString: string) =>
    format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");

  const formatFileSize = (bytes?: number | string) => {
    if (!bytes) return "0 bytes";
    const size = typeof bytes === "string" ? parseFloat(bytes) : bytes;
    if (isNaN(size)) return "0 bytes";
    const units = ["bytes", "KB", "MB", "GB"];
    let currentSize = size;
    let unitIndex = 0;
    while (currentSize >= 1024 && unitIndex < units.length - 1) {
      currentSize /= 1024;
      unitIndex++;
    }
    return `${currentSize.toFixed(unitIndex === 0 ? 0 : 1)} ${
      units[unitIndex]
    }`;
  };

  const renderMetadataItem = (
    icon: React.ReactNode,
    label: string,
    value: string,
    extraInfo?: string
  ) => (
    <div className="flex items-start gap-3 py-1">
      <div className="text-muted-foreground mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground ">{label}</p>
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="text-sm font-medium truncate">{value}</p>
          </TooltipTrigger>
          <TooltipContent>{value}</TooltipContent>
        </Tooltip>
        {extraInfo && (
          <p className="text-xs text-muted-foreground mt-0.5">{extraInfo}</p>
        )}
      </div>
    </div>
  );

  // Get owner information
  const owner =
    file.owners?.[0] ||
    file.permissions?.find((p) => p.role === "owner" && p.type === "user");

  // Extract file type for display
  const getFileType = () => {
    if (isFolder) return "Folder";
    if (file.mimeType.includes("application/vnd.google-apps.")) {
      const type = file.mimeType.split(".").pop();
      return type
        ? type.charAt(0).toUpperCase() + type.slice(1)
        : "Google File";
    }
    const ext = file.mimeType.split("/").pop();
    return ext ? ext.toUpperCase() : "File";
  };

  // Get last opened information
  const getLastOpenedInfo = () => {
    if (!file.viewedByMeTime) return null;

    return (
      <div className="flex items-start gap-3 py-1">
        {" "}
        {/* Reduced py */}
        <div className="text-muted-foreground mt-0.5">
          <Eye className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-1">Last opened</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">
              {formatDate(file.viewedByMeTime)}
            </p>
            <Badge
              variant="outline"
              className="text-xs h-5 px-1.5 border border-muted-foreground/50"
            >
              me
            </Badge>
          </div>
        </div>
      </div>
    );
  };

  // Check if anyone with the link permission exists
  const anyonePermission = file.permissions?.find((p) => p.type === "anyone");

  return (
    <TooltipProvider>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-[310px] sm:w-[480px] p-0 flex flex-col">
          {/* Sticky Header */}
          <div className="sticky top-0 bg-background z-10 px-6 -mt-2 ">
            <SheetHeader>
              <div className="flex items-start gap-2">
                <div
                  className="p-3 rounded-xl flex-shrink-0"
                  style={{
                    backgroundColor: `${color}33`,
                    color, // 0.2 opacity (darker)
                    boxShadow: `0 2px 8px ${color}66`, // 0.4 opacity (more visible shadow)
                  }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SheetTitle className="text-base font-semibold truncate cursor-default pl-1">
                        {file.name}
                      </SheetTitle>
                    </TooltipTrigger>
                    <TooltipContent>{file.name}</TooltipContent>
                  </Tooltip>
                  <div className="flex items-center gap-2 ">
                    <Badge
                      variant="outline"
                      className="text-xs px-2.5 py-0.5 rounded-md capitalize border border-muted-foreground/50"
                    >
                      {getFileType()}
                    </Badge>
                    {file.starred && (
                      <Badge
                        variant="outline"
                        className="text-xs px-2.5 py-0.5 rounded-md flex items-center gap-1 border border-muted-foreground/50"
                      >
                        <Star className="w-3 h-3" /> Starred
                      </Badge>
                    )}
                    {file.trashed && (
                      <Badge
                        variant="destructive"
                        className="text-xs px-2.5 py-0.5 rounded-md flex items-center gap-1 border border-muted-foreground/50"
                      >
                        <Trash2 className="w-3 h-3" /> Trashed
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </SheetHeader>
          </div>
          <Separator className="h-1 -mt-1 w-full bg-muted shadow-xl" />

          {/* Content */}
          <div className="overflow-y-auto px-6 pb-8">
            {/* Preview */}
            {!isFolder && (
              <div className="w-full aspect-square mt-4 mb-6 rounded-xl overflow-hidden border  bg-gradient-to-br from-muted/50 to-muted/30">
                <Thumbnail
                  src={`https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`}
                  fallback={
                    <div className="flex justify-center items-center h-full">
                      <div
                        className="p-5 rounded-lg"
                        style={{
                          backgroundColor: `${color}15`,
                          color,
                        }}
                      >
                        <Icon className="w-12 h-12 opacity-80" />
                      </div>
                    </div>
                  }
                  className="w-full h-full"
                  imgClassName="object-contain w-full h-full"
                />
              </div>
            )}
            {/* Activity Section */}
            <section className="space-y-2 mb-4">
              {" "}
              {/* Reduced space-y and mb */}
              <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                Activity
              </h3>
              <div className="space-y-1 pl-6">
                {file.viewedByMe && file.viewedByMeTime && getLastOpenedInfo()}
                {renderMetadataItem(
                  <FileText className="w-4 h-4" />,
                  "Last Modified",
                  formatDate(file.modifiedTime)
                )}
                {renderMetadataItem(
                  <Calendar className="w-4 h-4" />,
                  "Created",
                  formatDate(file.createdTime)
                )}
              </div>
            </section>
            <Separator className="my-3" /> {/* Reduced my */}
            {/* File Info Section */}
            <section className="space-y-2 mb-4">
              {" "}
              {/* Reduced space-y and mb */}
              <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <Info className="w-4 h-4" />
                File info
              </h3>
              <div className="space-y-1 pl-6">
                {!isFolder && // <-- only show size if NOT a folder
                  renderMetadataItem(
                    <HardDrive className="w-4 h-4" />,
                    "Size",
                    formatFileSize(file.quotaBytesUsed)
                  )}

                {renderMetadataItem(
                  <FileText className="w-4 h-4" />,
                  "File Type",
                  getFileType()
                )}

                {owner &&
                  renderMetadataItem(
                    <Crown className="w-4 h-4"></Crown>,
                    "Owner",
                    owner.displayName || owner.emailAddress || "Unknown",
                    owner.emailAddress && owner.displayName
                      ? owner.emailAddress
                      : undefined
                  )}

                {/* Show if anyone with link permission */}
                {anyonePermission
                  ? renderMetadataItem(
                      <Lock className="w-4 h-4" />,
                      "File sharing",
                      "Anyone with the link",
                      anyonePermission.role &&
                        anyonePermission.role !== "reader"
                        ? `Role: ${anyonePermission.role}`
                        : undefined
                    )
                  : renderMetadataItem(
                      <Users className="w-4 h-4" />,
                      "File sharing",
                      "Invited people only"
                    )}
              </div>
            </section>
            {/* Shared With Section */}
            {file.permissions?.some((p) => p.type === "user") && (
              <>
                <Separator className="my-3" />
                <section className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                    <Share2 className="w-4 h-4" />
                    Sharing
                  </h3>
                  <div className="space-y-1 pl-6">
                    <div className="text-xs text-muted-foreground mb-1">
                      {file.permissions.filter((p) => p.type === "user").length}{" "}
                      people have access
                    </div>
                    {file.permissions
                      .filter((p) => p.type === "user")
                      .sort((a, b) =>
                        a.role === "owner" ? -1 : b.role === "owner" ? 1 : 0
                      )
                      .map((permission, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between group hover:bg-muted/50 rounded-lg p-2 -mx-6 lg:-mx-3 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={
                                  permission.photoLink ||
                                  owner?.photoLink ||
                                  undefined
                                }
                                className="group-hover:opacity-80 transition-opacity"
                              />
                              <AvatarFallback className="text-xs bg-muted">
                                {(permission.displayName ||
                                  permission.emailAddress ||
                                  "?")[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <p className="text-sm font-medium leading-none truncate max-w-[160px] cursor-default">
                                    {permission.displayName ||
                                      permission.emailAddress ||
                                      "Unknown"}
                                  </p>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {permission.displayName ||
                                    permission.emailAddress ||
                                    "Unknown"}
                                </TooltipContent>
                              </Tooltip>
                              {permission.displayName &&
                                permission.emailAddress && (
                                  <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                                    {permission.emailAddress}
                                  </p>
                                )}
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="capitalize text-xs h-6 px-2.5 py-1 rounded-md border border-muted-foreground/50"
                          >
                            {permission.role === "owner"
                              ? "Owner"
                              : permission.role}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
};

export default FileDetailsSheet;
