import { useQuery } from "react-query";
import { getBedrooms } from "services/commonDataApi";

function useGetBedrooms() {
  return useQuery(["bedroom"], getBedrooms);
}

export default useGetBedrooms;
