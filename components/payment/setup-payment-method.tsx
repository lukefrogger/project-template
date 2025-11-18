import { PaymentElement } from "@stripe/react-stripe-js";

export default function SetupPaymentMethod() {
  return (
    <section className="min-h-[300px]">
      <PaymentElement />
    </section>
  );
}
