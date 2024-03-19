import React from "react";
import ModalComponent from "../../../../components/modalComponent/ModalComponent";
import useCreatePostGroup from "./useCreatePostGroup";

function CreatePostGroup() {
  const { isOpen, handleOpen, formik } = useCreatePostGroup();
  return (
    <div className="col-12">
      <div className="d-flex justify-content-between align-items-center">
        <h6 className="mb-0">Create New Group</h6>
        <button
          type="button"
          className="btn btn-common btn-follow px-3 create-post-group"
          onClick={handleOpen}
        >
          <i className="fas fa-edit"></i>
        </button>
      </div>
      <ModalComponent
        show={isOpen}
        onHide={handleOpen}
        size="xs"
        heading="Connected Users"
      >
        <div className="col-12">
          <label htmlFor="bio" className="form-label">
            Group Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Please enter the name of the Group"
            name="name"
            value={formik?.values?.name}
            onChange={formik?.handleChange("name")}
            onBlur={formik?.handleBlur("name")}
          />
          <p style={{ color: "red", fontSize: 12 }}>{formik.errors.name}</p>
        </div>
        <div className="text-end mt-3">
          <button
            onClick={formik?.handleSubmit}
            type="button"
            className="btn btn-common"
            // disabled={isUpdateDetailsLoading}
          >
            Create Group
          </button>
        </div>
      </ModalComponent>
    </div>
  );
}

export default CreatePostGroup;
