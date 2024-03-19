import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { getIdValue } from "../../../../../helpers";
import { useContext } from "react";
import { AuthContext } from "../../../../../context/authContext";
import {
  deletePostDocument,
  getPostDocumentListByPostId,
} from "../../../../../services/postDocumentApi";
import { showMessage } from "components/messageModal/MessageModal";
import Swal from "sweetalert2";

function usePostDocumentList() {
  const params = useParams();
  const postId = getIdValue(params);
  const auth = useContext(AuthContext);
  let loginUserId = Number(auth?.auth?.userId);
  const query = useQuery(["documentList", postId], () =>
    getPostDocumentListByPostId(postId)
  );
  const deleteMutation = useMutation(deletePostDocument);
  const queryClient = useQueryClient();

  const handleDelete = (data) => {
    showMessage({
      isVisible: true,
      title: "Delete Document",
      message: "Are you sure you want to delete this document?",
      successFn: () => {
        deleteMutation.mutate(
          {
            ...data,
          },
          {
            onSuccess: async (res) => {
              Swal.fire({
                title: "Success",
                text: res?.data?.message,
                icon: "success",
              });
              await queryClient.invalidateQueries(["documentList", postId]);
            },
            onError: (err) => {
              Swal.fire({
                title: "Error",
                text: err?.response?.data?.message,
                icon: "error",
              });
            },
          }
        );
      },
    });
  };
  return { ...query, handleDelete, loginUserId };
}

export default usePostDocumentList;
