import { useState } from "react";

function useCreatePostDocument() {
  const [isOpen, setIsOpen] = useState(false);
  const handleModalOpen = () => setIsOpen((prev) => !prev);

  return { isOpen, handleModalOpen };
}

export default useCreatePostDocument;
