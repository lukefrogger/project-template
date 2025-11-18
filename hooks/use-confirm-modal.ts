import { useCallback } from "react";
import { confirmModalStore } from "@/stores/confirm-modal";
import { ConfirmModalProps } from "@/components/confirm-modal";

export const useConfirmModal = () => {
  const { open, close } = confirmModalStore();

  const confirm = useCallback(
    (props: ConfirmModalProps): Promise<boolean> => {
      return new Promise((resolve) => {
        const handleConfirm = () => {
          resolve(true);
        };

        const handleCancel = () => {
          close();
          resolve(false);
        };

        open(props, handleConfirm, handleCancel);
      });
    },
    [open, close],
  );

  return { confirm, close };
};
