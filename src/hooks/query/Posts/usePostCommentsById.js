import {
    useQuery
} from 'react-query';
import {
    postsService
} from '../../../services/PostApi';

const getPostCommentsById = async (id) => {
    const res = await postsService.getCommentsById(id);

    if (res) {
        return res;
    }
    return null;
};

export default function usePostCommentsById(postId) {
    const result = useQuery(['comments-id', postId], () => getPostCommentsById(postId));
    return result;
}