import { useState } from "react";

function useOfferPrice() {
  const [isCreateOfferModalOpen, setIsCreateOfferModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const handleCreateOfferModalOpen = () =>
    setIsCreateOfferModalOpen((prev) => !prev);
  const handleListModalOpen = () => setIsListModalOpen((prev) => !prev);

  return {
    handleCreateOfferModalOpen,
    handleListModalOpen,
    isListModalOpen,
    isCreateOfferModalOpen,
  };
}

export default useOfferPrice;
