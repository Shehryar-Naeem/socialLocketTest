import { getIdValue } from "helpers";
import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getEventsByFromUserId, getEventsByToUserId } from "services/eventsApi";

function useEventList(isPostCreator, userId) {
  const params = useParams();
  const postId = getIdValue(params);

  return useQuery(
    ["eventList", postId],
    () =>
      !isPostCreator
        ? getEventsByFromUserId(userId)
        : getEventsByToUserId(userId),
    {
      select: (res) => {
        if (res?.length) {
          let data = res.sort(
            (a, b) => new Date(b.created) - new Date(a.created)
          );

          return data;
        }
        return res;
      },
    }
  );
}

export default useEventList;
