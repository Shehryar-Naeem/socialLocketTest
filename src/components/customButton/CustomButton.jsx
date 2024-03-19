import { ProgressSpinner } from "primereact/progressspinner";
import React from "react";

function CustomButton({
  title,
  onClick,
  disabled,
  isLoading,
  className,
  style,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      //   className="btn btn-common"
      className={`btn btn-common btn-follow ${className}`}
      disabled={disabled || isLoading}
      style={style}
    >
      {isLoading ? (
        <ProgressSpinner
          color="var(--brand-color)"
          style={{ width: "15px", height: "15px" }}
          strokeWidth="4"
        />
      ) : (
        title
      )}
    </button>
  );
}

export default CustomButton;
