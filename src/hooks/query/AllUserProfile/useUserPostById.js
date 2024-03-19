import { useQuery } from "react-query";
import { userService } from "../../../services/UserService";

export const getUserPostById = async (userId) => {
  const res = await userService.getUserPosts(userId);
  if (res) {
    return res;
  }
  return null;
};

export default function useUserPosts(id) {
  const result = useQuery(["users-post", id], () => getUserPostById(id));
  return result;
}
