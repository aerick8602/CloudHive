// // components/thumbnail-with-fallback.tsx
// import { useState } from "react";

// interface ThumbnailProps {
//   src: string;
//   alt?: string;
//   fallback: React.ReactNode;
//   className?: string;
//   imgClassName?: string;
//   thumnailLink?: string;
// }

// export const Thumbnail: React.FC<ThumbnailProps> = ({
//   thumnailLink,
//   src,
//   alt = "thumbnail",
//   fallback,
//   className = "",
//   imgClassName = "",
// }) => {
//   const [loaded, setLoaded] = useState(false);

//   return (
//     <div
//       className={`relative h-full overflow-hidden flex items-center justify-center  ${className}`}
//     >
//       {!loaded && (
//         <div className="absolute inset-0 flex items-center justify-center">
//           {fallback}
//         </div>
//       )}
//       <img
//         src={src}
//         alt={alt}
//         onLoad={() => setLoaded(true)}
//         className={`transition-opacity duration-300 w-full h-full object-cover ${
//           loaded ? "opacity-100" : "opacity-0"
//         } ${imgClassName}`}
//       />
//     </div>
//   );
// };

import { useState, useEffect } from "react";

interface ThumbnailProps {
  src: string;
  alt?: string;
  fallback: React.ReactNode;
  className?: string;
  imgClassName?: string;
  thumnailLink?: string;
}

export const Thumbnail: React.FC<ThumbnailProps> = ({
  src,
  thumnailLink,
  alt = "thumbnail",
  fallback,
  className = "",
  imgClassName = "",
}) => {
  const [currentSrc, setCurrentSrc] = useState<string | null>(src);
  const [loaded, setLoaded] = useState(false);
  const [attempted, setAttempted] = useState<Set<string>>(new Set());

  // Handle failure of current image
  const handleError = () => {
    setAttempted((prev) => {
      const updated = new Set(prev);
      updated.add(currentSrc!);

      // Try thumbnailLink if not tried
      if (thumnailLink && !updated.has(thumnailLink)) {
        setCurrentSrc(thumnailLink);
      } else {
        setCurrentSrc(null); // No image to show, fallback will render
      }

      return updated;
    });
  };

  useEffect(() => {
    setCurrentSrc(src); // reset on src change
    setLoaded(false);
    setAttempted(new Set());
  }, [src, thumnailLink]);

  return (
    <div
      className={`relative h-full overflow-hidden flex items-center justify-center ${className}`}
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          {fallback}
        </div>
      )}

      {currentSrc && (
        <img
          src={currentSrc}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={handleError}
          className={`transition-opacity duration-300 w-full h-full object-cover ${
            loaded ? "opacity-100" : "opacity-0"
          } ${imgClassName}`}
        />
      )}
    </div>
  );
};
