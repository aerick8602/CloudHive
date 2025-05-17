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
import { ScrollArea } from "@/components/ui/scroll-area";
import { getIconForMimeType } from "@/utils/icons";
import { Badge } from "@/components/ui/badge";
import { Thumbnail } from "../thumbnail";
import { FileText, Folder, Users, Info, Star, Trash2, Eye } from "lucide-react";

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
    if (!bytes) return "N/A";
    const size = typeof bytes === "string" ? parseFloat(bytes) : bytes;
    if (isNaN(size)) return "N/A";
    const units = ["B", "KB", "MB", "GB"];
    let currentSize = size;
    let unitIndex = 0;
    while (currentSize >= 1024 && unitIndex < units.length - 1) {
      currentSize /= 1024;
      unitIndex++;
    }
    return `${currentSize.toFixed(1)} ${units[unitIndex]}`;
  };

  const renderMetadataItem = (
    icon: React.ReactNode,
    label: string,
    value: string
  ) => (
    <div className="flex items-center gap-3 py-1.5">
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-80 sm:max-w-lg">
        {/* <SheetHeader className="space-y-4">
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-lg bg-muted"
              style={{ backgroundColor: `${color}10`, color }}
            >
              <Icon className="w-8 h-8" />
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-xl truncate">{file.name}</SheetTitle>
              <p className="text-sm text-muted-foreground">
                {file.mimeType.split(".").pop()?.toUpperCase() ||
                  (isFolder ? "Folder" : "File")}
              </p>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
          <div className="space-y-6 py-4">
       
            {!isFolder && (
              <div className="w-full flex items-center justify-center bg-muted rounded-md p-4">
                <Thumbnail
                  src={`https://drive.google.com/thumbnail?id=${file.id}`}
                  fallback={
                    <Icon style={{ color }} className="w-32 h-32 opacity-70" />
                  }
                  className="max-w-full max-h-64 object-contain"
                />
              </div>
            )}

      
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Info className="w-4 h-4" />
                <h3 className="text-sm font-medium">File Information</h3>
              </div>

              <div className="space-y-2 pl-6">
                {renderMetadataItem(
                  <FileText className="w-4 h-4" />,
                  "Size",
                  formatFileSize(file.quotaBytesUsed)
                )}
                {renderMetadataItem(
                  <FileText className="w-4 h-4" />,
                  "Created",
                  formatDate(file.createdTime)
                )}
                {renderMetadataItem(
                  <FileText className="w-4 h-4" />,
                  "Modified",
                  formatDate(file.modifiedTime)
                )}
                {file.viewedByMe &&
                  file.viewedByMeTime &&
                  renderMetadataItem(
                    <Eye className="w-4 h-4" />,
                    "Last viewed",
                    formatDate(file.viewedByMeTime)
                  )}
              </div>
            </div>

            <Separator />

    
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Star className="w-4 h-4" />
                <h3 className="text-sm font-medium">Status</h3>
              </div>

              <div className="flex flex-wrap gap-2 pl-6">
                {file.starred && (
                  <Badge variant="secondary" className="gap-1">
                    <Star className="w-3 h-3" /> Starred
                  </Badge>
                )}
                {file.trashed && (
                  <Badge variant="destructive" className="gap-1">
                    <Trash2 className="w-3 h-3" /> In Trash
                  </Badge>
                )}
                {file.viewedByMe && (
                  <Badge variant="outline" className="gap-1">
                    <Eye className="w-3 h-3" /> Viewed
                  </Badge>
                )}
              </div>
            </div>

            <Separator />


            {file.permissions?.some(
              (p) => p.type === "user" && p.role !== "owner"
            ) && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <h3 className="text-sm font-medium">Shared with</h3>
                </div>

                <div className="space-y-3 pl-6">
                  {file.permissions
                    .filter((p) => p.type === "user" && p.role !== "owner")
                    .map((permission, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={permission.photoLink || undefined}
                            />
                            <AvatarFallback>
                              {permission.displayName
                                ?.charAt(0)
                                .toUpperCase() ||
                                permission.emailAddress
                                  ?.charAt(0)
                                  .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {permission.displayName ||
                                permission.emailAddress}
                            </p>
                            {permission.displayName && (
                              <p className="text-xs text-muted-foreground">
                                {permission.emailAddress}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {permission.role}
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div> 
        </ScrollArea>*/}
      </SheetContent>
    </Sheet>
  );
};

export default FileDetailsSheet;
