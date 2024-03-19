import React, { useContext, useState } from "react";
import { AuthContext } from "../../../../context/authContext";
import {
  hideLoadingSpinner,
  showLoadingSpinner,
} from "../../../../components/messageModal/MessageModal";
import {
  addGroupMember,
  getGroupMembersByPostId,
} from "../../../../services/postGroupApi";
import { useQuery, useQueryClient } from "react-query";

function usePostConnectedUsers(postGroupDetail) {
  const [isOpen, setIsOpen] = useState(false);
  const auth = useContext(AuthContext);
  const userId = auth?.auth?.userId;
  const handleOpen = () => setIsOpen((prev) => !prev);
  return { isOpen, handleOpen, userId };
}

export default usePostConnectedUsers;
