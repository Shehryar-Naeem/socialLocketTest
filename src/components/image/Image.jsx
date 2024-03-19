import React, { useState } from "react";
import PlaceholderImage from "./placeholder.png";
const Image = ({
  src,

  className,
  style,
  imageStyle,
  imageClassName,
  errorImageStyle,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className={`" custom_image " ${className}`}>
      {!imageError && (
        <img
          src={src ?? ""}
          alt="Avatar"
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{
            display: imageLoaded ? "block" : "none",
            ...imageStyle,
          }}
          className={imageClassName}
        />
      )}
      {imageError && (
        <img
          src={PlaceholderImage}
          alt="Placeholder Avatar"
          style={{ objectFit: "contain", ...imageStyle, ...errorImageStyle }}
          className={imageClassName}
        />
      )}
    </div>
  );
};

export default Image;
