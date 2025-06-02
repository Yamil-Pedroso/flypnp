import React, { useEffect, useState } from "react";

interface WebpImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

const WebpImage: React.FC<WebpImageProps> = ({
  src,
  alt = "",
  width,
  height,
  className,
}) => {
  const [webpSrc, setWebpSrc] = useState<string>("");

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const webpDataUrl = canvas.toDataURL("image/webp", 0.8);
      setWebpSrc(webpDataUrl);
    };
  }, [src]);

  return (
    <img
      src={webpSrc || src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
    />
  );
};

export default WebpImage;
