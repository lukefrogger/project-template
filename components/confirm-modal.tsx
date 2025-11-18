import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { confirmModalStore } from "@/stores/confirm-modal";
import { useEffect, useState } from "react";
import LoadingButton from "./loading-button";

export type ConfirmModalProps = {
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  isDestructive?: boolean;
};

export function ConfirmModal() {
  const { isOpen, data, onConfirm, onCancel } = confirmModalStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(false);
    }
  }, [isOpen]);

  if (!data) return null;

  const handleOpenChange = (open: boolean) => {
    if (loading) return;

    if (!open) {
      onCancel?.();
    }
  };

  const handleConfirm = () => {
    setLoading(true);
    onConfirm?.();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{data.title}</AlertDialogTitle>
          <AlertDialogDescription>{data.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={loading}>
            {data.cancelLabel}
          </AlertDialogCancel>
          <LoadingButton
            isLoading={loading}
            variant={data.isDestructive ? "destructive" : "default"}
            onClick={handleConfirm}
          >
            {data.confirmLabel}
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
