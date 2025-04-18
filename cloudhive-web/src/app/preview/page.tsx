import React from "react";

interface GoogleDrivePreviewProps {
  fileId: string;
  height?: string;
}

const GoogleDrivePreview: React.FC<GoogleDrivePreviewProps> = ({
  fileId = "1IuJVZy9TPnan0IT9r25tVA5IC84rLxQp",
  height = "700px", // recommended fixed height
}) => {
  const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;

  return (
    <div className="relative z-10 h-full w-full">
      <iframe
        src="https://drive.google.com/file/d/1i0n-XBj5WozU7M-hk4wir8DvwRADRSpW/preview"
        allow="autoplay"
      ></iframe>
    </div>
  );
};

export default GoogleDrivePreview;
