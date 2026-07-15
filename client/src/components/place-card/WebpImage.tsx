import type { FC } from "react";

interface WebpImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

const WebpImage: FC<WebpImageProps> = ({
  src,
  alt = "",
  width,
  height,
  className,
}) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
};

export default WebpImage;
