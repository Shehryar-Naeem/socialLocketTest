import React, { useContext } from "react";
import { useQuery } from "react-query";
import { getUserPostById } from "../../../hooks/query/AllUserProfile/useUserPostById";
import { AuthContext } from "../../../context/authContext";
import { getPosts } from "../../../hooks/query/Posts/usePosts";

function useInventory(type) {
  const { auth } = useContext(AuthContext);
  const userId = auth?.userId;

  const posts = useQuery(["posts", type], getPosts, {
    select: (res) => {
      return res?.filter((item) => item?.customer_user_id === userId);
    },
    enabled: type === "purchased",
  });

  const potentialOrSold = useQuery(
    ["users-posts", userId, type],
    () => getUserPostById(userId),
    {
      select: (res) => {
        return res?.filter((item) =>
          type === "potential"
            ? item?.status === "available" ||
              item?.offer_price ||
              !item?.purchased_price?.trim()
            : item?.status === "sold" || item?.purchased_price
        );
      },
      enabled: type === "potential" || type === "sold",
    }
  );

  return type === "purchased" ? posts : potentialOrSold;
}

export default useInventory;
