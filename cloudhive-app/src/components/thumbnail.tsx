// components/thumbnail-with-fallback.tsx
import { useState } from "react";

interface ThumbnailProps {
  src: string;
  alt?: string;
  fallback: React.ReactNode;
  className?: string;
  imgClassName?: string;
}

export const Thumbnail: React.FC<ThumbnailProps> = ({
  src,
  alt = "thumbnail",
  fallback,
  className = "",
  imgClassName = "",
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`relative h-full overflow-hidden flex items-center justify-center  ${className}`}
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          {fallback}
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`transition-opacity duration-300 w-full h-full object-cover ${
          loaded ? "opacity-100" : "opacity-0"
        } ${imgClassName}`}
      />
    </div>
  );
};
