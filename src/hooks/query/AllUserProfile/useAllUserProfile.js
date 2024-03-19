import { useQuery } from 'react-query';
import { userService } from '../../../services/UserService';

const getUserProfile = async () => {
  const res = await userService.getAllUserProfile();
  // console.log(res);
  if (res) {
    return res;
  }
  return null;
};

export default function useAllUserProfile(options = {}) {
  return useQuery('users', getUserProfile, options);
}
