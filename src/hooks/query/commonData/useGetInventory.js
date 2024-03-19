import { useQuery } from "react-query";
import { getInventory } from "services/commonDataApi";

function useGetInventory() {
  return useQuery(["inventory-get"], getInventory);
}

export default useGetInventory;
