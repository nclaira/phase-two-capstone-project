"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ModalType = "delete-post" | "delete-comment" | "edit-profile" | null;

interface ModalContextType {
  isOpen: boolean; 
  modalType: ModalType; 
  modalData: any;
  openModal: (type: ModalType, data?: any) => void; 
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<any>(null);

  const openModal = (type: ModalType, data?: any) => {
    setModalType(type);
    setModalData(data);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalType(null);
    setModalData(null);
  };

  const value: ModalContextType = {
    isOpen,
    modalType,
    modalData,
    openModal,
    closeModal,
  };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export function useModal() {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  return context;
}

