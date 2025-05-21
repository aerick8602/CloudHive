import { Progress } from "@/components/ui/progress";
import {
  Check,
  X,
  AlertTriangle,
  Loader2,
  LoaderIcon,
  LoaderPinwheel,
} from "lucide-react";
import { MdErrorOutline } from "react-icons/md";

interface UploadToastProps {
  progress: number;
  totalFiles: number;
  fileText: string;
  status: string;
}

function ProgressWithPercentage({ value }: { value: number }) {
  const isComplete = value === 100;
  const isStart = value === 0;
  const isError = value < 100 && value > 0;

  return (
    <div className="relative w-full">
      <Progress
        value={value}
        className={`h-2 transition-all duration-300 ${
          isComplete
            ? "bg-green-100"
            : isError
              ? "bg-destructive/20"
              : "bg-primary/20"
        }`}
      />
    </div>
  );
}

export function UploadToast({
  progress,
  totalFiles,
  fileText,
  status,
}: UploadToastProps) {
  const isComplete = progress === 100;
  const isUploading = progress > 0 && progress < 100;

  return (
    <div className="flex flex-col gap-3 w-[326px]  md:w-[320px] p-3 rounded-md border bg-background shadow-sm">
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex-shrink-0 ${
            isComplete
              ? "text-green-500"
              : isUploading
                ? "text-primary"
                : "text-muted-foreground"
          }`}
        >
          {isComplete ? (
            <Check className="h-5 w-5" />
          ) : isUploading ? (
            <LoaderIcon className="h-5 w-5 animate-spin" />
          ) : (
            <LoaderPinwheel className="h-5 w-5" />
          )}
        </div>

        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span
              className={`text-sm font-medium truncate max-w-[160px] ${
                isComplete ? "text-green-600" : "text-foreground"
              }`}
            >
              {isComplete
                ? "Upload complete!"
                : `Uploading ${totalFiles} ${fileText}`}
            </span>
            {isUploading && (
              <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                {progress}%
              </span>
            )}
          </div>

          <span className="text-xs text-muted-foreground truncate max-w-[240px]">
            {isComplete
              ? `Successfully uploaded ${totalFiles} ${fileText} to your drive`
              : status}
          </span>

          {/* {isUploading && <ProgressWithPercentage value={progress} />} */}
          {<ProgressWithPercentage value={progress} />}
        </div>
      </div>
    </div>
  );
}

export function UploadErrorToast({
  totalFiles,
  fileText,
  progress,
}: {
  totalFiles: number;
  fileText: string;
  progress: number;
}) {
  return (
    <div className="flex flex-col gap-3 w-[320px] p-3 rounded-lg border bg-background shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0 text-destructive">
          <MdErrorOutline className="h-5 w-5" />
        </div>

        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-destructive truncate max-w-[160px]">
              Upload failed!
            </span>
            <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
              {progress}%
            </span>
          </div>

          <span className="text-xs text-muted-foreground truncate max-w-[240px]">
            Failed to upload {totalFiles} {fileText}
          </span>

          <ProgressWithPercentage value={progress} />
        </div>
      </div>
    </div>
  );
}
