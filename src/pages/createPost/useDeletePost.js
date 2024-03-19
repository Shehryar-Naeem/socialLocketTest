import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { deletePost } from "../../services/PostApi";
import {
  hideLoadingSpinner,
  showLoadingSpinner,
} from "../../components/messageModal/MessageModal";
import Swal from "sweetalert2";

function useDeletePost(userId) {
  const queryClient = useQueryClient();
  return useMutation(deletePost, {
    onMutate: () => showLoadingSpinner({}),
    onSuccess: async (res) => {
      await queryClient.invalidateQueries(["users-post", userId + ""]);
      Swal.fire({
        title: "Delete Post",
        text: res?.data?.message,
        icon: "success",
      });
    },
    onSettled: () => hideLoadingSpinner(),
    onError: (err, data) => {
      Swal.fire({
        title: "Delete Post",
        text: err?.response?.data?.message,
        icon: "error",
      });
    },
  });
}

export default useDeletePost;
