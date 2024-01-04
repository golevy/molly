import { create } from "zustand";

export interface ModalStoreInterface {
  isOpen: boolean;
  toggleModal: (isOpen: boolean) => void;
}

const useAuthModal = create<ModalStoreInterface>((set) => ({
  isOpen: false,
  toggleModal: (isOpen: boolean) => set({ isOpen }),
}));

export default useAuthModal;
