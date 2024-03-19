import { useQuery } from "react-query";
import { getUserTypeList } from "services/commonDataApi";

function useGetUserType() {
  return useQuery(["user-type-data"], getUserTypeList);
}

export default useGetUserType;
