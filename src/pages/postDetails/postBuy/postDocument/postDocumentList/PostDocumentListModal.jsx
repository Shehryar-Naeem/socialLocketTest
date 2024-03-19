import React from "react";
import usePostDocumentList from "./usePostDocumentList";
import LoadingSpinner from "../../../../../components/messageModal/LoadingSpinner";
import CustomFileIcon from "../../../../../components/customFileIcon/CustomFileIcon";
import Avatar from "../../../../../components/image/Avatar";

function PostDocumentListModal() {
  const { data, isLoading, handleDelete, loginUserId } = usePostDocumentList();
  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div>
      {!data?.length ? (
        <div> No Data</div>
      ) : (
        data?.map((item) => (
          <div className="card my-2 p-2" key={item?.id}>
            <div className="d-flex align-items-center">
              <Avatar
                src={item?.profile_image}
                firstName={item?.forename}
                lastName={item?.surname}
              />
              <p className="ms-2">{item?.forename + " " + item?.surname}</p>
            </div>
            <CustomFileIcon
              file={{
                name: item?.name,
                url: item?.document,
              }}
              key={item?.id + ""}
              className={"my-2 card-header"}
              onDelete={
                item?.user_id === loginUserId ? () => handleDelete(item) : null
              }
            />
          </div>
        ))
      )}
    </div>
  );
}

export default PostDocumentListModal;
