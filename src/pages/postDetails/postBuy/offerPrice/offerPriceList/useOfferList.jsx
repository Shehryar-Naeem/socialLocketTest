import React from "react";
import { useQuery } from "react-query";
import {
  getOfferByPostId,
  getOfferFromUserId,
} from "../../../../../services/postOfferApi";
import { useParams } from "react-router-dom";
import { getIdValue } from "../../../../../helpers";

function useOfferList(isPostCreator, userId) {
  const params = useParams();
  const postId = getIdValue(params);
  return useQuery(
    ["offerList", postId],
    () =>
      isPostCreator ? getOfferByPostId(postId) : getOfferFromUserId(userId),
    {
      select: (res) => {
        if (res?.length) {
          let temp = res.sort(
            (a, b) => new Date(b.created) - new Date(a.created)
          );
          let isOfferAccepted = temp?.find(
            (item) => Number(item?.offer_accepted) === 1
          );
          return {
            data: temp,
            isOfferAccepted,
          };
        }
        return res;
      },
    }
  );
}

export default useOfferList;
