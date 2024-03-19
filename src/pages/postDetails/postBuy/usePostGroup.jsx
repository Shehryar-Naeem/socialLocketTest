import { useQueries, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { getIdValue } from "../../../helpers";
import {
  getAllPostGroup,
  getGroupMembersByPostId,
  getPostGroupAdmins,
  getRequestFromUserID,
  getRequestToUserID,
} from "../../../services/postGroupApi";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import { PostDetailContext } from "../PostDetailContext";

function usePostGroup() {
  const { setIsGroupMember } = useContext(PostDetailContext);

  const params = useParams();
  const postId = getIdValue(params);
  const auth = useContext(AuthContext);
  let loginUserId = Number(auth?.auth?.userId);

  const queryClient = useQueryClient();
  const [isShow, setIsShow] = useState(false);

  const postDetails = queryClient.getQueryData(["posts-id", postId]);
  const postGroupQuery = useQueries([
    {
      queryKey: ["my-request", loginUserId, Number(postId)],
      queryFn: () =>
        getRequestFromUserID({
          fromUserId: loginUserId,
        }),
      enabled: !!loginUserId,
      select: (res) => {
        if (res) {
          return res?.filter((data) => data?.post_id === Number(postId));
        }
      },
    },
    // {
    //   queryKey: ["request-received", loginUserId, postId],
    //   queryFn: () =>
    //     getRequestToUserID({
    //       toUserId: loginUserId,
    //     }),
    //   enabled: !!loginUserId,
    // },
    {
      queryKey: ["postGroup", postId],
      queryFn: getAllPostGroup,
      enabled: !!postId,
      select: (res) => {
        if (res) {
          return res?.find((item) => Number(item?.post_id) === Number(postId));
        }
      },
    },
  ]);
  const [myRequest, postGroupData] = postGroupQuery;
  // const postGroupData = useQuery(["postGroup", postId], getAllPostGroup, {
  //   enabled: !!postId,
  //   select: (res) => {
  //     if (res) {
  //       return res?.find((item) => Number(item?.post_id) === Number(postId));
  //     }
  //   },
  // });

  const postGroupMembers = useQuery(
    ["postGroupMembers", postGroupData?.data?.id],
    () =>
      getGroupMembersByPostId({
        postId: postGroupData?.data?.id,
      }),
    {
      enabled: !!postGroupData?.data?.id,
    }
  );
  const postGroupAdmin = useQuery(
    ["postGroupAdmin", postGroupData?.data?.id],
    () =>
      getPostGroupAdmins({
        groupId: postGroupData?.data?.id,
      }),
    {
      enabled: !!postGroupData?.data?.id,
      select: (result) => {
        if (result) {
          let obj = {};
          result?.map((item) => {
            obj = {
              ...obj,
              [item?.user_id]: item,
            };
          });
          return obj;
        }
      },
    }
  );
  const [isNotGroupMember, setIsNotGroupMember] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  useEffect(() => {
    setIsCreator(
      postGroupData?.data?.user_id === loginUserId ||
        postDetails?.[0]?.user_id === loginUserId
    );
  }, [postGroupData?.data, postGroupData?.isLoading, postDetails]);
  useEffect(() => {
    const isGroupMember = postGroupMembers?.data?.find(
      (item) => item?.user_id === loginUserId
    );
    if (!loginUserId) {
      return setIsShow(false);
    }
    if (
      loginUserId === Number(postDetails?.[0]?.user_id) ||
      isGroupMember ||
      postGroupAdmin?.data?.[loginUserId]
    ) {
      setIsShow(true);
      setIsGroupMember(true);
      setIsNotGroupMember(false);
    } else {
      setIsNotGroupMember(true);
    }
  }, [postDetails, postGroupMembers, postGroupAdmin]);
  return {
    postGroupData,
    postDetails,
    isShow,
    postGroupAdmin,
    isNotGroupMember,
    myRequest,
    isCreator,
    // getRequestList,
  };
}

export default usePostGroup;
