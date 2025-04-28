import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  fileName?: string;
  fileSize?: string;
  isComplete?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, fileName, fileSize, isComplete, ...props }, ref) => (
    <div ref={ref} className={cn("w-full space-y-2", className)} {...props}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium truncate max-w-[200px]">{fileName}</span>
        <span className="text-muted-foreground">{fileSize}</span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/20">
        <div
          className={cn(
            "h-full w-full flex-1 transition-all",
            isComplete ? "bg-green-500" : "bg-primary"
          )}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{Math.round(value)}%</span>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <>
              <Check className="size-4 text-green-500" />
              <span>Complete</span>
            </>
          ) : (
            <span>Uploading...</span>
          )}
        </div>
      </div>
    </div>
  )
);
Progress.displayName = "Progress";

export { Progress };
