import React from "react";
import ModalComponent from "../../../../../../components/modalComponent/ModalComponent";
import useCreateRequest from "./useCreateRequest";

function PostGroupRequestModal({ postGroupData, requestData }) {
  const {
    isOpen,
    handleModal,
    handleCreateRequest,
    error,
    handleOnChange,
    message,
  } = useCreateRequest(postGroupData, requestData);
  const isRequestCreated = requestData?.length;

  const isRejected = requestData?.some(
    (request) => request.request_accepted === "0"
  );
  const hasNullRequest = requestData?.some(
    (request) => request.request_accepted === null
  );

  const isCreateNewRequest =
    isRequestCreated && (isRejected ? hasNullRequest : hasNullRequest);
  console.log({
    isRejected,
    hasNullRequest,
    requestData,
  });
  return (
    <>
      <div className="d-flex align-items-center justify-content-between gap-10 w-100">
        <h6 className="mb-0">Group Details</h6>
        <button
          type="button"
          className="btn btn-dark btn-follow btn-sm"
          onClick={handleModal}
        >
          {isCreateNewRequest ? "Request Sent" : "Create Request"}
        </button>
      </div>
      <ModalComponent
        show={isOpen}
        onHide={handleModal}
        size="lg"
        heading={isCreateNewRequest ? "View Request" : "Create Request"}
      >
        {isCreateNewRequest ? (
          <div>
            <p></p>
            Status :{" "}
            {requestData[requestData?.length - 1]?.request_accepted === null
              ? "Pending"
              : requestData[requestData?.length - 1]?.request_accepted === "0"
              ? "Rejected"
              : "Accepted"}
            <p>message : {requestData[requestData?.length - 1]?.message}</p>
          </div>
        ) : (
          <>
            <textarea
              placeholder="Please enter your message"
              className="form-control"
              onChange={handleOnChange}
              value={message}
            ></textarea>
            {error && <div style={{ color: "red" }}>{error}</div>}

            <div className="d-flex align-items-center justify-content-end mt-3">
              <button
                type="button"
                className="btn btn-common btn-follow px-3 btn-sm"
                onClick={handleCreateRequest}
              >
                <i className="fa-regular fa-user"></i> Create Request
              </button>
            </div>
          </>
        )}
      </ModalComponent>
    </>
  );
}

export default PostGroupRequestModal;
