import React, { useState } from "react";
import ModalComponent from "../../../../../components/modalComponent/ModalComponent";
import PostDocumentListModal from "./PostDocumentListModal";

function PostDocumentList() {
  const [isOpen, setIsOpen] = useState(false);
  const handleModalOpen = () => setIsOpen((prev) => !prev);
  return (
    <>
      {" "}
      <button
        type="button"
        className="btn btn-common btn-follow "
        onClick={handleModalOpen}
      >
        <small>
          <i className="fas fa-stream"></i> List of Documents
        </small>
      </button>
      <ModalComponent
        show={isOpen}
        onHide={handleModalOpen}
        size="lg"
        heading="Document List"
      >
        <PostDocumentListModal handleClose={handleModalOpen} />
      </ModalComponent>
    </>
  );
}

export default PostDocumentList;
