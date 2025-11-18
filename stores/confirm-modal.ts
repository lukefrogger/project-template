import { create } from "zustand";
import { ConfirmModalProps } from "@/components/confirm-modal";

type ConfirmModalStore_T = {
  isOpen: boolean;
  data: ConfirmModalProps | null;
  onConfirm?: () => void;
  onCancel?: () => void;

  // Actions
  open: (data: ConfirmModalProps, onConfirm?: () => void, onCancel?: () => void) => void;
  close: () => void;
};

export const confirmModalStore = create<ConfirmModalStore_T>((set) => ({
  isOpen: false,
  data: null,
  onConfirm: undefined,
  onCancel: undefined,

  open: (data, onConfirm, onCancel) =>
    set({
      isOpen: true,
      data,
      onConfirm,
      onCancel,
    }),

  close: () =>
    set({
      isOpen: false,
      onConfirm: undefined,
      onCancel: undefined,
    }),
}));
