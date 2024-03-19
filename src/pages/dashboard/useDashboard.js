import { useContext } from "react";
import { useQueries } from "react-query";
import { AuthContext } from "../../context/authContext";
import {
  getDashboardByStatus,
  getDashboardByUserId,
} from "../../services/dashboard";

const useDashboard = (status) => {
  const { auth } = useContext(AuthContext);
  const userId = auth?.userId;
  const dashboardQuery = useQueries([
    {
      queryKey: ["dashboard", userId],
      queryFn: () =>
        getDashboardByUserId({
          userId,
        }),
      enabled: !!userId,
    },
    {
      queryKey: ["dashboard", userId, status],
      queryFn: () =>
        getDashboardByStatus({
          status: "",
          userId,
        }),
      enabled: !!userId,
    },
  ]);
  const isLoading = dashboardQuery.some((result) => result.isLoading);
  const isRefetching = dashboardQuery.some((result) => result.isRefetching);
  return { dashboardQuery, isLoading, isRefetching };
};

export default useDashboard;
