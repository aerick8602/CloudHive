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
  const [failedAttempts, setFailedAttempts] = useState<string[]>([]);

  // Handle failure of current image
  const handleError = () => {
    setFailedAttempts(prev => {
      const updated = [...prev, currentSrc!];
      
      // If we haven't tried thumbnailLink yet, try it
      if (thumnailLink && !updated.includes(thumnailLink)) {
        setCurrentSrc(thumnailLink);
      } else {
        // If we've tried both URLs, show fallback
        setCurrentSrc(null);
      }
      
      return updated;
    });
  };

  useEffect(() => {
    // Reset everything when src or thumbnailLink changes
    setCurrentSrc(src);
    setLoaded(false);
    setFailedAttempts([]);
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
