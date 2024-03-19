import React from "react";
import ModalComponent from "../../../../components/modalComponent/ModalComponent";
import usePostConnectedUsers from "./usePostConnectedUsersModal";
import ConnectionList from "../../../profile/components/ConnectionList";
import PostMembersModal from "./PostMembersModal";

function PostConnectedUsersModal({ postGroupData, postGroupAdmin }) {
  const { isOpen, handleOpen, userId } = usePostConnectedUsers();

  return (
    <>
      <button
        type="button"
        className="btn btn-dark btn-follow btn-sm"
        onClick={handleOpen}
      >
        <i className="fas fa-user-plus me-2"></i>
        Users
      </button>
      <ModalComponent
        show={isOpen}
        onHide={handleOpen}
        size="lg"
        heading="Connected Users"
      >
        <PostMembersModal
          postId={postGroupData?.post_id}
          userId={userId}
          postGroupDetail={postGroupData}
          postGroupAdmin={postGroupAdmin}
        />
      </ModalComponent>
    </>
  );
}

export default PostConnectedUsersModal;
