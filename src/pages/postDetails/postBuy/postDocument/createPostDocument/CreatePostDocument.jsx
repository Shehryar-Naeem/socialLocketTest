import React from "react";
import ModalComponent from "../../../../../components/modalComponent/ModalComponent";
import CreatePostDocumentModal from "./CreatePostDocumentModal";
import useCreatePostDocument from "./useCreatePostDocument";

function CreatePostDocument() {
  const { handleModalOpen, isOpen } = useCreatePostDocument();
  return (
    <div>
      <button
        type="button"
        className="btn btn-common btn-follow me-2"
        onClick={handleModalOpen}
      >
        <small>
          <i className="fas fa-file-upload"></i> Upload
        </small>
      </button>
      <ModalComponent
        show={isOpen}
        onHide={handleModalOpen}
        size="lg"
        heading="Upload Document"
      >
        <CreatePostDocumentModal handleClose={handleModalOpen} />
      </ModalComponent>
    </div>
  );
}

export default CreatePostDocument;
