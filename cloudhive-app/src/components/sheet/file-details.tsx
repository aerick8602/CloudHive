"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FileData } from "@/interface";

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
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Detail</SheetTitle>
          <iframe
            src={`https://drive.google.com/file/d/${file.id}/preview`}
            width="100%"
            height="400px"
            style={{ border: "none" }}
            allowFullScreen
            title="File Preview"
          ></iframe>
          {/* You can add further description or information here */}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default FileDetailsSheet;
