import React, { useContext, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { getIdValue } from "../../../../../../helpers";
import { AuthContext } from "../../../../../../context/authContext";
import { useParams } from "react-router-dom";
import {
  addGroupMember,
  getRequestToUserID,
  updateUserRequest,
} from "../../../../../../services/postGroupApi";

function useRequestList() {
  const params = useParams();

  const postId = getIdValue(params);
  const auth = useContext(AuthContext);
  let loginUserId = Number(auth?.auth?.userId);
  const [isOpen, setIsOpen] = useState(false);
  const handleModal = () => setIsOpen((prev) => !prev);
  const queryClient = useQueryClient();
  const requestList = useQuery(
    ["request-received", loginUserId, postId],
    () =>
      getRequestToUserID({
        toUserId: loginUserId,
      }),
    {
      enabled: !!loginUserId,
      select: (res) => {
        if (res) {
          return res?.filter((item) => item?.post_id === Number(postId));
        }
      },
    }
  );
  const [isLoadingId, setIsLoadingId] = useState(null);
  const handleRequest = async (item, value) => {
    try {
      const { id } = item;
      setIsLoadingId({
        id,
        value,
      });
      let obj = {
        ...item,
        request_accepted: value,
      };
      await updateUserRequest(obj);
      if (value === "1") {
        await addGroupMember({
          user_id: item?.from_user_id,
          post_group_id: item?.post_group_id,
          admin_id: loginUserId,
        });
        await queryClient?.invalidateQueries({
          queryKey: ["groupMember", item?.post_group_id],
        });
      }

      await queryClient.invalidateQueries({
        queryKey: ["request-received", loginUserId, postId],
      });
    } catch (error) {
    } finally {
      setIsLoadingId(null);
    }
  };

  return { isOpen, handleModal, requestList, handleRequest, isLoadingId };
}

export default useRequestList;
