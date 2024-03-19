import React, { useCallback } from "react";
import { useQueries, useQuery } from "react-query";
import { userService } from "../../../services/UserService";
import moment from "moment";

function useMessage({ currentUserId, userId }) {
  let query = useQueries([
    {
      queryKey: ["message", userId, currentUserId],

      queryFn: () =>
        userService.getMessages({
          data: {
            to_user_id: currentUserId,
            from_user_id: userId,
          },
        }),
    },

    {
      queryKey: ["message", currentUserId, userId],

      queryFn: () =>
        userService.getMessages({
          data: {
            to_user_id: userId,
            from_user_id: currentUserId,
          },
        }),
    },
  ]);
  const isLoading = query.some((result) => result.isLoading);
  let data = [];

  if (!isLoading && query[0]?.data) {
    data = [...query[0]?.data, ...query[1]?.data];
    data.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return (
        new Date(moment(a.created).toDate()) -
        new Date(moment(b.created).toDate())
      );
    });
  }

  const refetch = useCallback(() => {
    query.forEach((result, index) => result.refetch());
  }, [query]);

  console.log({ messages: data });
  return { data, isLoading, refetch };
}

export default useMessage;
