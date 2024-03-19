import { useQuery } from 'react-query';
import { postsService } from '../../../services/PostApi';

const getPostsBy = async (postId) => {
  const res = await postsService.getPostsById(postId);

  if (res) {
    return res;
  }
  return null;
};

export default function usePostsById(id) {
  const result = useQuery(['posts-id', id], () => getPostsBy(id));
  return result;
}
