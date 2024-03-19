import React, { useState } from "react";
import VerifiedIcon from "assets/svg/verificationTick.png";

const Avatar = ({
  src,
  firstName = "S",
  lastName = "S",
  imageClassName,
  imageStyle,
  onClick,
  isVerified,
}) => {
  const [imageError, setImageError] = useState(src ? false : true);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const getInitials = (firstName, lastName) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`;
    } else if (firstName) {
      return firstName.charAt(0);
    } else if (lastName) {
      return lastName.charAt(0);
    } else {
      return "";
    }
  };

  const imageBaseStyle = {
    border: "2px solid var(--brand-color)",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 50,
    borderRadius: 50,
    color: "white",
    objectFit: "cover",
    display: "flex",
    textTransform: "uppercase",
    fontSize: 22,
  };

  return (
    <div
      className="avatar position-relative"
      style={{
        ...imageBaseStyle,
        backgroundColor: imageLoaded ? "transparent" : "#e0e0e0",
      }}
      onClick={onClick}
    >
      {isVerified ? <img src={VerifiedIcon} className="verified_icon" /> : null}
      {!imageError && (
        <img
          src={src}
          alt="Avatar"
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{
            ...imageBaseStyle,
            display: imageLoaded ? "block" : "none",
            ...imageStyle,
          }}
          className={imageClassName}
        />
      )}
      {imageError && (
        <div
          style={{
            ...imageBaseStyle,
            ...imageStyle,
          }}
          className={imageClassName}
        >
          {getInitials(firstName, lastName)}
        </div>
      )}
    </div>
  );
};

export default Avatar;
