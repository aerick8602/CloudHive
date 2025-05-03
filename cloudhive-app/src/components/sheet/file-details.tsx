"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface FileDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FileDetailsSheet: React.FC<FileDetailsProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Detail</SheetTitle>
          {/* You can add further description or information here */}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default FileDetailsSheet;
