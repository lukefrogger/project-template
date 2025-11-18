"use client";
import { Elements, useElements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useContext, createContext, useMemo, useState, useEffect } from "react";

const stripePromiseInternal = () => loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const Context = createContext<{ stripe: Stripe | null } | null>(null);

export const initStripe = () => {
  const [stripe, setStripe] = useState<Stripe | null>(null);

  useEffect(() => {
    const loadStripe = async () => {
      const stripeInstance = await stripePromiseInternal();
      setStripe(stripeInstance);
    };
    loadStripe();
  }, []);

  return stripe;
};

export const useStripeContext = () => {
  const stripeCtx = useContext(Context);
  if (!stripeCtx) {
    throw new Error("useStripe must be used within a StripeContext");
  }
  if (!stripeCtx === null) {
    console.warn("Stripe is not initialized yet");
  }
  const elements = useElements();

  return { ...stripeCtx, elements };
};

export const StripeContext = ({
  children,
  stripe,
  elementOptions,
}: {
  children: React.ReactNode;
  stripe: Stripe | null;
  elementOptions: StripeElementsOptions;
}) => {
  const [resolvedStripe, setResolvedStripe] = useState<Stripe | null>(null);

  useEffect(() => {
    setResolvedStripe(stripe);
  }, [stripe]);

  const options = useMemo(() => {
    return (
      elementOptions || {
        mode: "setup",
        currency: "usd",
        // appearance: {},
      }
    );
  }, [elementOptions]);

  if (!resolvedStripe) {
    return null;
  }

  return (
    <Context.Provider value={{ stripe: resolvedStripe }}>
      <Elements stripe={resolvedStripe} options={options}>
        {children}
      </Elements>
    </Context.Provider>
  );
};
