import { ProgressSpinner } from "primereact/progressspinner";
import React from "react";

function LoadingSpinner({ size = 10 }) {
  return (
    <div>
      <ProgressSpinner
        color="#00c8c8"
        style={{ width: size * 2, height: size * 2 }}
        strokeWidth="6"
        className="me-2"
      />
    </div>
  );
}

export default LoadingSpinner;
