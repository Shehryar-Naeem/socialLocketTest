import React from "react";
import useRequestList from "./useRequestList";
import ModalComponent from "../../../../../../components/modalComponent/ModalComponent";
import Avatar from "../../../../../../components/image/Avatar";
import { ProgressSpinner } from "primereact/progressspinner";

function PostGroupRequestList({}) {
  const {
    handleModal,
    isOpen,
    requestList: { data, isLoading },
    handleRequest,
    isLoadingId,
  } = useRequestList();
  return (
    <>
      <button
        type="button"
        className="btn btn-outline-dark btn-follow btn-sm ms-2"
        onClick={handleModal}
      >
        <i className="fas fa-user-friends"></i>
      </button>
      <ModalComponent
        show={isOpen}
        onHide={handleModal}
        size="lg"
        heading={"Request List"}
      >
        {isLoading
          ? "Loading..."
          : !data?.length
          ? "No data"
          : data?.map((item) => (
              <div
                key={item?.id}
                className="d-flex align-items-center mb-3 pb-3 border-bottom"
              >
                <Avatar firstName={item?.forename} lastName={item?.surname} />
                <div className="ms-2" style={{ flex: 1 }}>
                  <p className="mb-0">
                    <strong>{item?.forename + " " + item?.surname}</strong>
                  </p>
                  <span>{item?.message}</span>
                </div>

                {item?.request_accepted === null ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-common unfollow-btn  me-2 btn-sm"
                      disabled={isLoadingId?.id}
                      onClick={() => handleRequest(item, "0")}
                    >
                      {isLoadingId?.id === item?.id &&
                      isLoadingId?.value === "0" ? (
                        <ProgressSpinner
                          color="#fff"
                          style={{ width: "10px", height: "10px" }}
                          strokeWidth="4"
                        />
                      ) : (
                        "Reject"
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-common btn-follow btn-sm"
                      onClick={() => handleRequest(item, "1")}
                      disabled={isLoadingId?.id}
                    >
                      {isLoadingId?.id === item?.id &&
                      isLoadingId?.value === "1" ? (
                        <ProgressSpinner
                          color="#fff"
                          style={{ width: "10px", height: "10px" }}
                          strokeWidth="4"
                        />
                      ) : (
                        "Accept"
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className={`btn btn-common btn-follow btn-sm ${
                      item?.request_accepted === "0"
                        ? "unfollow-btn"
                        : "btn-follow"
                    }`}
                    disabled
                  >
                    {item?.request_accepted === "0" ? "Rejected" : "Accepted"}
                  </button>
                )}
              </div>
            ))}
      </ModalComponent>
    </>
  );
}

export default PostGroupRequestList;
