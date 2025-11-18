import { StripeElementsOptions } from "@stripe/stripe-js";

export const newSubscriptionSettings: StripeElementsOptions = {
  mode: "subscription",
  currency: "usd",
  setupFutureUsage: "off_session",
};

export const newPaymentMethodSettings: StripeElementsOptions = {
  mode: "setup",
  currency: "usd",
  setupFutureUsage: "off_session",
};
