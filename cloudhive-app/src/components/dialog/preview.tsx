import React from "react";
import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PreviewBoxProps {
  previewUrl: string;
  setShowPreview: (show: boolean) => void;
  localname: string;
  downloadUrl?: string;
  showPreview: boolean;
}

const PreviewBox: React.FC<PreviewBoxProps> = ({
  showPreview,
  previewUrl,
  setShowPreview,
  localname,
  downloadUrl,
}) => {
  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", localname);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={showPreview} onOpenChange={setShowPreview}>
      <DialogContent className="w-[95vw] max-w-[95vw] md:w-[80vw] md:max-w-[80vw] lg:w-[60vw] lg:max-w-[60vw] h-[80vh] md:h-[85vh] lg:h-[95vh] flex flex-col !p-0 overflow-hidden">
        <DialogHeader className="px-4 py-2.5 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-row items-center justify-between">
          <DialogTitle className="text-base sm:text-lg font-semibold tracking-tight truncate max-w-[70%] md:max-w-[80%]">
            {localname}
          </DialogTitle>
          <div className="flex items-center gap-2">
            {downloadUrl && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors rounded-full mr-6 sm:-mt-0.5"
                aria-label="Download file"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>
        <div className="flex-1 relative min-h-0 -mt-3">
          <iframe
            src={previewUrl}
            className="w-full h-full border-0"
            allowFullScreen
            title={`Preview of ${localname}`}
            aria-label={`Preview content of ${localname}`}
            onError={() => console.error("Failed to load preview")}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewBox;
