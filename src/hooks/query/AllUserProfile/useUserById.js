import { useQuery } from "react-query";
import { userService } from "../../../services/UserService";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../../context/authContext";
import { save } from "../../../utils/Storage";

const getUserById = async (userId) => {
  const res = await userService.getUserProfile(userId);
  if (res) {
    return res;
  }
  return null;
};

export default function useSelectedTypesBy(id) {
  const value = useContext(AuthContext);
  const userId = value?.auth?.userId ? value?.auth?.userId.toString() : "";

  const result = useQuery(["users", id], () => getUserById(id), {
    enabled: !!id,
  });

  useEffect(() => {
    if (
      Number(userId) === Number(id) &&
      result?.data &&
      !result?.isLoading &&
      !result?.isError
    ) {
      save("userDetails", result?.data);
      value?.setLoginUserDetail(result?.data);
    }
  }, [result]);

  return result;
}
