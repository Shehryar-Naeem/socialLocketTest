import { useQuery } from "react-query";
import { getGroupMembersByPostId } from "../../../../services/postGroupApi";

function useGetGroupMembers(post_group_id) {
  return useQuery(
    ["groupMember", post_group_id],
    () =>
      getGroupMembersByPostId({
        postId: post_group_id,
      }),
    {
      enabled: !!post_group_id,
      select: (res) => {
        if (res) {
          let obj = {};
          res?.map((item) => {
            obj = {
              ...obj,
              [item?.user_id]: item,
            };
          });
          return obj;
        }
      },
    }
  );
}

export default useGetGroupMembers;
