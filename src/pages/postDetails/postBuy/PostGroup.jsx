import React from "react";
import PostConnectedUsersModal from "./postConnectedUsersModal/PostConnectedUsersModal";
import usePostGroup from "./usePostGroup";
import CreatePostGroup from "./createPostGroup/CreatePostGroup";
import { useQueryClient } from "react-query";
import PostGroupRequestModal from "./postConnectedUsersModal/request/createRequest/PostGroupRequestModal";
import PostGroupRequestList from "./postConnectedUsersModal/request/requestList/PostGroupRequestList";

function PostGroup() {
  const {
    postGroupAdmin,
    postGroupData: { data, isLoading },
    isShow,
    isNotGroupMember,
    myRequest,
    isCreator,
  } = usePostGroup();
  if (!isShow && !isNotGroupMember) {
    return;
  }

  return (
    <div className="w-100 create-request d-flex">
      {data ? (
        isNotGroupMember ? (
          <PostGroupRequestModal
            postGroupData={data}
            requestData={myRequest?.data}
          />
        ) : (
          <div className="d-flex align-items-center justify-content-between gap-10 w-100">
            <h6 className="mb-0">Group Details</h6>
            <div>
              <PostConnectedUsersModal
                postGroupData={data}
                postGroupAdmin={postGroupAdmin?.data}
              />
              {isCreator && (
                <PostGroupRequestList
                  postGroupData={data}
                  postGroupAdmin={postGroupAdmin?.data}
                />
              )}
            </div>
          </div>
        )
      ) : (
        isCreator && <CreatePostGroup />
      )}
    </div>
  );
}

export default PostGroup;
