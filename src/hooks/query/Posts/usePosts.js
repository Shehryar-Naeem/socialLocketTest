import { useQuery } from "react-query";
import { postsService } from "../../../services/PostApi";

export const getPosts = async (page, limit) => {
  const res = await postsService.getPosts(page, limit);
  if (res) {
    return res;
  }
  return null;
};

export default function usePosts(page = 1, limit = 10,options = {}) {
  return useQuery(['posts', page, limit], () => getPosts(page, limit), options);
}
