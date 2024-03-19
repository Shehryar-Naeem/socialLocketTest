import React from "react";

function CustomInput({
  label,
  type = "text",
  id,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  containerClassName,
}) {
  return (
    <div className={`col-12 ${containerClassName}`}>
      {label && (
        <label htmlFor="bio" className="form-label">
          {label}
        </label>
      )}
      <input
        type={type}
        className="form-control"
        id={id}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error && (
        <p style={{ color: "red", fontSize: 12, textAlign: "right" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default CustomInput;
