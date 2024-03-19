import React, { useContext } from "react";
import {
  getCommentsList,
  getLikesList,
  getGeneralNotificationById,
  getNotificationById,
  getNotificationList,
  getTotalUserList,
} from "../../services/notificationApi";
import { useQueries } from "react-query";
import { AuthContext } from "../../context/authContext";

export default function useNotification() {
  const { auth } = useContext(AuthContext);
  const userId = auth?.userId ? auth?.userId.toString() : "";
  // const [userList, commentList, likeList, notificationList] = useQueries([
  //   {
  //     queryKey: ["userList"],
  //     queryFn: () => getTotalUserList(),
  //     select: (res) => {
  //       let users = {};
  //       for (let i = 0; i < res?.length; i++) {
  //         users = {
  //           ...users,
  //           [res[i]?.id]: res[i],
  //         };
  //       }
  //       return users;
  //     },
  //   },
  //   {
  //     queryKey: ["commentsList", user_id],
  //     queryFn: () => getCommentsList(user_id),
  //   },
  //   { queryKey: ["likesList", user_id], queryFn: () => getLikesList(user_id) },
  //   {
  //     queryKey: ["notificationList", user_id],
  //     queryFn: () => getNotificationList(user_id),
  //   },
  // ]);
  const notificationQuery = useQueries([
    {
      queryKey: "personal_notification",
      queryFn: () =>
        getNotificationById({
          userId,
        }),
      enabled: !!userId,
    },
    {
      queryKey: "general_notification",
      queryFn: () =>
        getGeneralNotificationById({
          userId,
        }),
      enabled: !!userId,
    },
  ]);
  // console.log({ notificationList });
  const isLoading = notificationQuery.some((result) => result.isLoading);
  const [personalNotification, generalNotification] = notificationQuery;
  // let isLoading =
  //   commentList?.isLoading && likeList.isLoading && userList?.isLoading;
  // if (!isLoading) {
  //   var comments = commentList?.data?.map((el) => {
  //     return {
  //       ...el,
  //       otherUser: userList?.data?.[el.user_id],
  //       userDetail: userList?.data?.[user_id],
  //     };
  //   });
  //   var likes = likeList?.data?.map((el) => {
  //     return {
  //       ...el,
  //       otherUser: userList?.data?.[el.user_id],
  //       userDetail: userList?.data?.[user_id],
  //     };
  //   });
  // }

  // let mergeLikesAndComments = comments?.concat(likes);

  return { personalNotification, generalNotification, isLoading };
}
