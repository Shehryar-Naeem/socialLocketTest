import { useContext, useEffect, useState } from "react";
import {
  getAddressByUserId,
  getUserAddressById,
} from "../../../../services/addressApi";
import { AuthContext } from "../../../../context/authContext";

function useAddress(item, isReFetching) {
  const { auth } = useContext(AuthContext);
  const userId = auth?.userId;

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    !isReFetching && getAllAddresses();
  }, []);

  const getAllAddresses = async () => {
    try {
      setIsLoading(true);
      let addressByUserId = await getAddressByUserId(userId);
      let userAddress = await getUserAddressById({
        userId,
      });
      let temp = {};
      userAddress?.map((item) => {
        temp = {
          ...temp,
          [item?.id]: item,
        };
      });

      let tempData = addressByUserId?.map((item) =>
        temp[item?.id]
          ? {
              ...item,
              ...temp[item?.id],
            }
          : item
      );
      if (tempData) {
        setData((prev) => [...tempData]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    setData,
    isLoading,
    getAllAddresses,
  };
}

export default useAddress;
