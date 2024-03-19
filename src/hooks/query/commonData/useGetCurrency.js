import { useQuery } from "react-query";
import { getCurrency } from "services/commonDataApi";

function useGetCurrency() {
  return useQuery(["currency"], getCurrency);
}

export default useGetCurrency;
