import React from "react";
import { Download, X } from "lucide-react";

interface PreviewBoxProps {
  previewUrl: string;
  setShowPreview: (show: boolean) => void;
  localname: string;
  downloadUrl?: string;
}

const PreviewBox: React.FC<PreviewBoxProps> = ({
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
    <div
      onClick={() => setShowPreview(false)}
      className="fixed inset-0 bg-black/30 flex justify-center items-center z-[9999999] overflow-hidden"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[90%] max-w-4xl h-[90vh] bg-background rounded-lg shadow-2xl overflow-hidden flex flex-col border border-border"
      >
        {/* Header with filename and actions */}
        <div className="px-4 py-3 flex justify-between items-center bg-muted border-b border-border">
          <div
            className="text-base font-medium text-foreground truncate max-w-[calc(100%-100px)]"
            title={localname}
          >
            {localname}
          </div>

          <div className="flex gap-2">
            {downloadUrl && (
              <button
                onClick={handleDownload}
                className="p-1.5 rounded-full text-muted-foreground hover:bg-accent transition-colors hover:text-accent-foreground"
                aria-label="Download"
              >
                <Download className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => setShowPreview(false)}
              className="p-1.5 rounded-full text-muted-foreground hover:bg-accent transition-colors hover:text-accent-foreground"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview content */}
        <div className="flex-1 overflow-hidden relative">
          <iframe
            src={previewUrl}
            className="w-full h-full absolute top-0 left-0 border-none bg-background"
            allowFullScreen
            title={`Preview of ${localname}`}
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewBox;
