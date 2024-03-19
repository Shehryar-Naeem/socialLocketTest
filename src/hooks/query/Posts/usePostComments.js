import {
    useQuery
} from 'react-query';
import {
    postsService
} from '../../../services/PostApi';

const getPostComments = async () => {
    const res = await postsService.getAllPostComments();

    if (res) {
        return res;
    }
    return null;
};

export default function usePostComments(options = {}) {
    return useQuery('comments', getPostComments, options);
}
