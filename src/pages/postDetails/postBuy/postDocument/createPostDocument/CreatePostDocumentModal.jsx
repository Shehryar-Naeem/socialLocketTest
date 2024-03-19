import React from "react";
import Dropzone from "../../../../../components/dropzone/Dropzone";
import CustomButton from "../../../../../components/customButton/CustomButton";
import useCreatePostDocumentModal from "./useCreatePostDocumentModal";
import CustomFileIcon from "../../../../../components/customFileIcon/CustomFileIcon";

function CreatePostDocumentModal({ handleClose }) {
  const {
    handleOnDrop,
    formik: {
      values: { file, name },
      errors,
      setFieldValue,
      handleChange,
      handleBlur,
      touched,
      handleSubmit,
    },
    isLoading,
  } = useCreatePostDocumentModal(handleClose);
  return (
    <div>
      <input
        type="text"
        name="name"
        placeholder="Document name"
        className="form-control"
        onChange={handleChange}
        onBlur={handleBlur}
        value={name}
      />
      {errors?.name && touched?.name && (
        <p style={{ color: "red", fontSize: 12, marginLeft: 5 }}>
          {errors?.name}
        </p>
      )}

      <div className="my-2">
        <Dropzone onDrop={handleOnDrop} />
        {errors?.file && touched?.file && (
          <p style={{ color: "red", fontSize: 12, marginLeft: 5 }}>
            {errors?.file}
          </p>
        )}
      </div>

      <div>
        {file.map((item, index) => (
          <CustomFileIcon
            key={index}
            file={item}
            className={"my-3"}
            onRemove={() =>
              setFieldValue(
                "file",
                file?.filter((_, indx) => index !== indx)
              )
            }
          />
        ))}
      </div>

      <div className="d-flex align-items-center justify-content-center">
        <CustomButton
          title={"Upload"}
          onClick={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default CreatePostDocumentModal;
