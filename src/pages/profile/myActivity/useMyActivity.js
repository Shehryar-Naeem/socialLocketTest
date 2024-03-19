import { useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import { useQuery } from "react-query";
import {
  getCommentsList,
  getLikesList,
} from "../../../services/notificationApi";

function useMyActivity(type) {
  const { auth } = useContext(AuthContext);
  const user_id = auth?.userId ? auth?.userId.toString() : "";
  return useQuery(
    [type, user_id],
    () =>
      type === "myLikes" ? getLikesList(user_id) : getCommentsList(user_id),
    {
      enabled: !!type,
    }
  );
}

export default useMyActivity;
