import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";

function LoadingModal({ loadingText }) {
  return (
    <div
      style={{
        position: "fixed",
        height: "100vh",
        width: "100vw",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 999999999999999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="card"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "transparent",
          border: "none",
        }}
      >
        <ProgressSpinner
          color="#fff"
          style={{ width: "70px", height: "70px" }}
          strokeWidth="4"
        />
        <p
          style={{
            color: "#FFF",
          }}
        >
          {loadingText ?? "Please wait!"}
        </p>
      </div>
    </div>
  );
}

export default LoadingModal;
