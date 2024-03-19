import { useQuery } from "react-query";
import { userService } from "../../../services/UserService";

const getUserTypesId = async (userId) => {
  const res = await userService.getUserTypes(userId);

  if (res) {
    return res;
  }
  return null;
};

export default function useUsersById(id) {
  const result = useQuery(["users-types", id], () => getUserTypesId(id), {
    enabled: !!id,
  });
  return result;
}
