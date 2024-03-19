import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import PostMainCard from "./PostMainCard";
import useInventory from "./useInventory";

import UserImage from "../../../assets/images/empty-box.png";

function InventoryTab({ type = "potential" }) {
  const { data, isLoading, isRefetching } = useInventory(type);
  const [selectedPost, setSelectedPost] = useState(null);
  useEffect(() => {
    if (!isLoading && data?.length) {
      if (!selectedPost) {
        setSelectedPost(data[0]);
      } else {
        let target = data?.find((item) => item?.id === selectedPost?.id);
        setSelectedPost(target);
      }
    }
  }, [data]);

  return isLoading ? (
    <div>Loading</div>
  ) : (
    <div>
      <h2 className="text-center mb-3">
        {type === "sold"
          ? "Sold"
          : type === "purchased"
          ? "Purchased"
          : "Potential"}{" "}
        Listings
      </h2>
      {!data?.length ? (
        <div className="no-data-found">
          <div className="">
            <img
              loading="lazy"
              src={UserImage}
              alt=""
              width={200}
              height={200}
            />
            <h6 className="mt-3">No Data Found</h6>
          </div>
        </div>
      ) : (
        <div className="inventory">
          <div className="inventory-sidebar">
            <ul>
              {data?.map((item) => (
                <PostCard
                  key={item?.id + ""}
                  item={item}
                  setSelectedPost={setSelectedPost}
                  selectedPost={selectedPost}
                />
              ))}
            </ul>
          </div>
          <div className="inventory-right">
            <PostMainCard item={selectedPost} type={type} />
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryTab;
