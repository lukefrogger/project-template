import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import LoadingButton from "../loading-button";
import SetupPaymentMethod from "./setup-payment-method";
import { useStripeContext } from "@/hooks/use-stripe";
import { api } from "@/services/api";
import Message from "../message";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function SetupPaymentMethodModal() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { elements, stripe } = useStripeContext();
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (!elements || !stripe) {
        throw new Error("Stripe elements not initialized");
      }
      const { error: submitError } = await elements?.submit();
      if (submitError) {
        setError(submitError.message || "There is an issue with your payment method information.");
        return;
      }
      const { clientSecret } = await api.payments.createSetupIntent();
      const { error: confirmError } = await stripe.confirmSetup({
        elements,
        clientSecret,
        redirect: "if_required",
        confirmParams: {
          return_url: `${window.location.origin}/billing`,
        },
      });
      if (confirmError) {
        setError(confirmError.message || "There is an issue with your payment method information.");
        return;
      }

      // Hack to wait for the webhook to catch the new payment method
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      toast.success("Payment Method Added");
      setOpen(false);
    } catch (error) {
      console.error("Error submitting payment method:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseEvent = (e: Event) => {
    e.preventDefault();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" size="sm">
          Add Payment Method
        </Button>
      </DialogTrigger>
      <DialogContent
        onEscapeKeyDown={handleCloseEvent}
        onInteractOutside={handleCloseEvent}
        onFocusOutside={handleCloseEvent}
      >
        <DialogHeader>
          <DialogTitle>Change Payment Method</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <SetupPaymentMethod />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-between gap-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          {error && <Message variant="destructive" title="Error" description={error} />}
          <LoadingButton isLoading={isSubmitting} type="button" onClick={handleSubmit} disabled={isSubmitting}>
            Create Payment Method
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
