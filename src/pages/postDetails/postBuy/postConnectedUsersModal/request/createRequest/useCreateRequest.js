import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../../../../context/authContext";
import { createPostRequest } from "../../../../../../services/postGroupApi";
import { useQueryClient } from "react-query";
import {
  hideLoadingSpinner,
  showLoadingSpinner,
} from "../../../../../../components/messageModal/MessageModal";

function useCreateRequest(data) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const auth = useContext(AuthContext);
  let loginUserId = Number(auth?.auth?.userId);
  const handleModal = () => setIsOpen((prev) => !prev);
  const queryClient = useQueryClient();
  const handleOnChange = (event) => {
    const { value } = event.target;
    setMessage(value);
    error && setError("");
  };
  const handleCreateRequest = async (event) => {
    try {
      event.preventDefault();
      event.stopPropagation();
      if (!message?.trim()) {
        return setError("Message field is required");
      }
      showLoadingSpinner({});
      const obj = {
        post_id: data?.post_id,
        from_user_id: loginUserId,
        to_user_id: data?.user_id,
        post_group_id: data?.id,
        admin_request: "0",
        message,
      };
      await createPostRequest(obj);
      setMessage("");
      // await queryClient.invalidateQueries({
      //   queryKey: ["my-request", loginUserId, data?.post_id],
      // });
      await queryClient?.invalidateQueries({
        queryKey: ["my-request", loginUserId, data?.post_id],
      });
      handleModal();
      Swal.fire({
        title: "Request sent successfully!",
        icon: "success",
      });
    } catch (error) {
      console.error("ERRR", error);
      Swal.fire({
        title: "Something went wrong!",
        icon: "error",
      });
    } finally {
      hideLoadingSpinner();
    }
  };
  return {
    isOpen,
    handleModal,
    handleCreateRequest,
    error,
    message,
    handleOnChange,
  };
}

export default useCreateRequest;
