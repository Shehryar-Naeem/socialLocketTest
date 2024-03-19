import React from "react";
import Dropzone from "../../../../components/dropzone/Dropzone";
import useUploadDocument from "./useUploadDocument";
import LoadingSpinner from "../../../../components/messageModal/LoadingSpinner";
import CustomFileIcon from "../../../../components/customFileIcon/CustomFileIcon";
import CustomButton from "../../../../components/customButton/CustomButton";

function UploadDocuments() {
  const {
    formik: {
      values: { file, name },
      errors,
      setFieldValue,
      handleChange,
      handleBlur,
      touched,
      handleSubmit,
    },
    getFilesQuery: { data, isLoading: isFileLoading },
    handleOnDrop,
    isLoading,
    handleDelete,
    deleteMutation,
  } = useUploadDocument();
  return isFileLoading ? (
    <LoadingSpinner />
  ) : (
    <>
      <h3 className="mb-4">Update Documents</h3>

      <div className="col-md-12">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="Please enter the name of the Document"
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
      </div>
      <div className="col-md-12 my-4">
        <label htmlFor="upload-documents" className="form-label">
          Upload Documents
        </label>

        <Dropzone onDrop={handleOnDrop} />
        {errors?.file && touched?.file && (
          <p style={{ color: "red", fontSize: 12, marginLeft: 5 }}>
            {errors?.file}
          </p>
        )}
      </div>

      <div className="alert alert-warning small" role="alert">
        <p className="mb-0">
          <strong>2 forms of photo ID -</strong> Passport, Driving License,
          Identity Card
        </p>
      </div>
      <div className="alert alert-warning small" role="alert">
        <p className="mb-0">
          <strong>1 Proof of address -</strong> Driving License, Utility Bill
          (Last 3 months. E.g. Phone bill, Dewa, Council Tax, Gas/Electric/Water
          bill, Bank Statement)
        </p>
      </div>

      <div className="my-2">
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
      {!!file?.length && (
        <div className="d-flex align-items-center justify-content-center">
          <CustomButton
            title={"Upload"}
            onClick={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      )}
      {data?.map((file) => (
        <CustomFileIcon
          file={{
            name: file.name,
            url: file?.files,
          }}
          className={"my-2 "}
          onDelete={() => handleDelete(file?.id)}
          isDeleteLoading={deleteMutation?.isLoading}
        />
      ))}
    </>
  );
}

export default UploadDocuments;
