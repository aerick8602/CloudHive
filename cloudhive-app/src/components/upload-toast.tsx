// import { Progress } from "@/components/ui/progress";
// import { Check, Loader2, X } from "lucide-react";
// import { MdErrorOutline } from "react-icons/md";
// import { motion } from "framer-motion";

// interface UploadToastProps {
//   progress: number;
//   totalFiles: number;
//   fileText: string;
//   status: string;
//   onClose?: () => void;
// }

// function ProgressWithPercentage({ value }: { value: number }) {
//   return (
//     <div className="relative w-full overflow-hidden rounded-md">
//       <Progress value={value} className="h-[3px] bg-muted dark:bg-muted/30" />
//       <motion.div
//         className="absolute top-0 left-0 h-full bg-foreground/70 dark:bg-white/70 rounded-md"
//         initial={{ width: 0 }}
//         animate={{ width: `${value}%` }}
//         transition={{ duration: 0.4, ease: "easeOut" }}
//       />
//     </div>
//   );
// }

// export function UploadToast({
//   progress,
//   totalFiles,
//   fileText,
//   status,
//   onClose,
// }: UploadToastProps) {
//   const isComplete = progress === 100;
//   const isUploading = progress > 0 && progress < 100;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: 8 }}
//       className="relative flex w-[357px]   p-4 rounded-xl border border-border bg-background shadow-xl"
//     >
//       {/* Close Button */}
//       <motion.button
//         onClick={onClose}
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.95 }}
//         className="absolute top-1.5 right-1.5 rounded-full p-1 hover:bg-muted transition"
//       >
//         <X className="h-4 w-4 text-muted-foreground" />
//       </motion.button>

//       <div className="flex gap-3 items-start w-full">
//         {/* Icon */}
//         <div className="flex-shrink-0 pt-1">
//           {isComplete ? (
//             <motion.div
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               transition={{ type: "spring", stiffness: 400 }}
//               className="text-green-500"
//             >
//               <Check className="h-5 w-5" />
//             </motion.div>
//           ) : isUploading ? (
//             <motion.div
//               animate={{ rotate: 360 }}
//               transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
//               className="text-primary"
//             >
//               <Loader2 className="h-5 w-5" />
//             </motion.div>
//           ) : (
//             <Loader2 className="h-5 w-5 text-muted-foreground" />
//           )}
//         </div>

//         {/* Content */}
//         <div className="flex-1 flex flex-col gap-1.5 pr-2">
//           <span className="text-sm font-semibold text-foreground truncate max-w-[180px]">
//             {isComplete
//               ? "Upload complete"
//               : `Uploading ${totalFiles} ${fileText}`}
//           </span>

//           <div className="flex justify-between items-center">
//             <span className="text-xs text-muted-foreground truncate max-w-[180px]">
//               {isComplete
//                 ? `Successfully uploaded ${totalFiles} ${fileText}`
//                 : status}
//             </span>
//             <motion.span
//               className="text-xs text-muted-foreground ml-2"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//             >
//               {progress}%
//             </motion.span>
//           </div>

//           <ProgressWithPercentage value={progress} />
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// export function UploadErrorToast({
//   totalFiles,
//   fileText,
//   progress,
//   onClose,
// }: {
//   totalFiles: number;
//   fileText: string;
//   progress: number;
//   onClose?: () => void;
// }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: 8 }}
//       className="relative flex w-[357px]    p-4 rounded-xl border border-border bg-background shadow-xl"
//     >
//       {/* Close Button */}
//       <motion.button
//         onClick={onClose}
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.95 }}
//         className="absolute top-1.5 right-1.5 rounded-full p-1 hover:bg-muted transition"
//       >
//         <X className="h-4 w-4 text-muted-foreground" />
//       </motion.button>

//       <div className="flex gap-3 items-start w-full">
//         <div className="pt-1 text-destructive">
//           <MdErrorOutline className="h-5 w-5" />
//         </div>

//         <div className="flex-1 flex flex-col gap-1.5 pr-2">
//           <span className="text-sm font-semibold text-destructive truncate max-w-[180px]">
//             Upload failed
//           </span>

//           <div className="flex justify-between items-center">
//             <span className="text-xs text-muted-foreground truncate max-w-[180px]">
//               Failed to upload {totalFiles} {fileText}
//             </span>
//             <span className="text-xs text-muted-foreground ml-2">
//               {progress}%
//             </span>
//           </div>

//           <ProgressWithPercentage value={progress} />
//         </div>
//       </div>
//     </motion.div>
//   );
// }

import { Progress } from "@/components/ui/progress";
import { Check, Loader2, X } from "lucide-react";
import { MdErrorOutline } from "react-icons/md";
import { motion } from "framer-motion";

interface UploadToastProps {
  progress: number;
  totalFiles: number;
  fileText: string;
  status: string;
  onClose?: () => void;
}

function ProgressWithPercentage({ value }: { value: number }) {
  return (
    <div className="relative w-full overflow-hidden rounded-md">
      <Progress value={value} className="h-[3px] bg-muted dark:bg-muted/30" />
      <motion.div
        className="absolute top-0 left-0 h-full bg-foreground/70 dark:bg-white/70 rounded-md"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>
  );
}

export function UploadToast({
  progress,
  totalFiles,
  fileText,
  status,
  onClose,
}: UploadToastProps) {
  const isComplete = progress === 100;
  const isUploading = progress > 0 && progress < 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="relative flex max-w-[90vw] w-full max-w-md p-4 rounded-xl border border-border bg-background shadow-xl mx-auto"
    >
      {/* Close Button */}
      <motion.button
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-1.5 right-1.5 rounded-full p-1 hover:bg-muted transition"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </motion.button>

      <div className="flex gap-3 items-start w-full">
        {/* Icon */}
        <div className="flex-shrink-0 pt-1">
          {isComplete ? (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="text-green-500"
            >
              <Check className="h-5 w-5" />
            </motion.div>
          ) : isUploading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
              className="text-primary"
            >
              <Loader2 className="h-5 w-5" />
            </motion.div>
          ) : (
            <Loader2 className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-1.5 pr-2">
          <span className="text-sm font-semibold text-foreground truncate max-w-[180px]">
            {isComplete
              ? "Upload complete"
              : `Uploading ${totalFiles} ${fileText}`}
          </span>

          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground truncate max-w-[180px]">
              {isComplete
                ? `Successfully uploaded ${totalFiles} ${fileText}`
                : status}
            </span>
            <motion.span
              className="text-xs text-muted-foreground ml-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {progress}%
            </motion.span>
          </div>

          <ProgressWithPercentage value={progress} />
        </div>
      </div>
    </motion.div>
  );
}

export function UploadErrorToast({
  totalFiles,
  fileText,
  progress,
  onClose,
}: {
  totalFiles: number;
  fileText: string;
  progress: number;
  onClose?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="relative flex max-w-[90vw] w-full max-w-md p-4 rounded-xl border border-border bg-background shadow-xl mx-auto"
    >
      {/* Close Button */}
      <motion.button
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-1.5 right-1.5 rounded-full p-1 hover:bg-muted transition"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </motion.button>

      <div className="flex gap-3 items-start w-full">
        <div className="pt-1 text-destructive">
          <MdErrorOutline className="h-5 w-5" />
        </div>

        <div className="flex-1 flex flex-col gap-1.5 pr-2">
          <span className="text-sm font-semibold text-destructive truncate max-w-[180px]">
            Upload failed
          </span>

          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground truncate max-w-[180px]">
              Failed to upload {totalFiles} {fileText}
            </span>
            <span className="text-xs text-muted-foreground ml-2">
              {progress}%
            </span>
          </div>

          <ProgressWithPercentage value={progress} />
        </div>
      </div>
    </motion.div>
  );
}
