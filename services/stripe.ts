import "server-only";
import { PaymentMethod, SetupIntent, PaymentIntent } from "@stripe/stripe-js";
import { log } from "@/services/logger";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "");

export const createSetupIntent = async (customerId: string): Promise<SetupIntent> => {
  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    automatic_payment_methods: {
      enabled: true,
    },
  });
  return setupIntent as SetupIntent;
};

export const verifyNewCustomer = async (email: string, fullName: string): Promise<string | null> => {
  try {
    const customers = await stripe.customers.list({
      email: email,
      limit: 10,
    });

    if (!customers.data || customers.data.length === 0) {
      const newCustomer = await stripe.customers.create({
        email: email,
        name: fullName,
      });
      return newCustomer.id;
    }

    if (customers.data.length === 1) {
      return customers.data[0].id;
    }

    const sortedCustomers = customers.data.sort((a, b) => {
      const aTimestamp = a.created ? a.created : a.created;
      const bTimestamp = b.created ? b.created : b.created;
      return bTimestamp - aTimestamp;
    });

    return sortedCustomers[0].id;
  } catch (error) {
    console.error("Error verifying customer:", error);
    return null;
  }
};

export const createSubscription = async ({
  customerId,
  priceId,
  confirmationTokenId,
  metadata,
}: {
  customerId: string;
  priceId: string;
  confirmationTokenId: string;
  metadata?: Record<string, string>;
}) => {
  try {
    const existingSubscription = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    if (existingSubscription.data.length > 0) {
      return { status: "existing-active", clientSecret: "" };
    }

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payments"],
      metadata,
    });

    // @ts-expect-error - the expanded payments in not typed correctly
    const paymentIntentId = subscription?.latest_invoice?.payments?.data[0]?.payment?.payment_intent;
    // @ts-expect-error - the clientSecret is only available because we're using the .confirm() method.
    const { status, clientSecret } = await stripe.paymentIntents.confirm(paymentIntentId, {
      confirmation_token: confirmationTokenId,
    });

    log.info("Payment intent confirmed", { status, customerId });

    return { status, clientSecret };
  } catch (error: any) {
    log.error("Error creating subscription:", error, { error, customerId, priceId, metadata });
    return { error: error.message };
  }
};

export const renewSubscription = async ({
  customerId,
  priceId,
  paymentMethodId,
  metadata,
}: {
  customerId: string;
  priceId: string;
  paymentMethodId: string;
  metadata?: Record<string, string>;
}) => {
  if (!priceId || !paymentMethodId) {
    throw new Error("Invalid request. Price and payment method are required.");
  }
  const existingSubscription = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
    limit: 1,
  });
  if (existingSubscription.data.length > 0) {
    throw new Error("Membership already exists. Cannot create a new one.");
  }

  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
        },
      ],
      collection_method: "charge_automatically",
      payment_behavior: "error_if_incomplete",
      default_payment_method: paymentMethodId,
      payment_settings: { save_default_payment_method: "on_subscription" },
      metadata,
    });

    log.info("Membership subscription renewed", { subscription: subscription.id, customerId });
    return subscription;
  } catch (error: any) {
    log.error("Error renewing membership subscription:", error, { customerId, priceId, paymentMethodId, metadata });
    throw new Error("Error renewing membership.");
  }
};

export const getPaymentMethods = async (customerId: string): Promise<PaymentMethod[]> => {
  const paymentMethods = await stripe.customers.listPaymentMethods(customerId);
  return paymentMethods.data as PaymentMethod[];
};

export const createInvoiceAndAttachPayment = async ({
  customerId,
  paymentIntentId,
  amount,
  description,
  metadata,
}: {
  customerId: string;
  paymentIntentId: string;
  amount: number;
  description: string;
  metadata?: Record<string, string>;
}) => {
  try {
    const invoice = await stripe.invoices.create({
      customer: customerId,
      description,
      metadata,
      auto_advance: false,
    });

    if (!invoice.id) {
      log.error("No stripe invoice id", new Error());
      throw Error("No stripe invoice id");
    }

    await stripe.invoiceItems.create({
      customer: customerId,
      invoice: invoice.id,
      amount: amount * 100,
      description,
    });

    await stripe.invoices.finalizeInvoice(invoice.id);

    const updateInvoice = await stripe.invoices.attachPayment(invoice.id, {
      payment_intent: paymentIntentId,
    });

    return updateInvoice;
  } catch (error: any) {
    log.error("Error creating and charging invoice:", error);
    return { error: error.message };
  }
};

export const convertStripeTimestamp = (timestamp: number): Date => {
  return new Date(timestamp * 1000);
};

export const createNewStripeSubscription = async (
  customerId: string,
  priceId: string,
  paymentMethodId: string,
  metadata?: Record<string, string>,
) => {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [
      {
        price: priceId,
      },
    ],
    default_payment_method: paymentMethodId,
    off_session: true,
    collection_method: "charge_automatically",
    metadata,
  });
  return subscription;
};

export const createAndPayTransaction = async ({
  customerId,
  paymentMethodId,
  amount,
  description,
  metadata,
  statementDescriptor,
}: {
  customerId: string;
  paymentMethodId: string;
  amount: number;
  description: string;
  metadata?: Record<string, string>;
  statementDescriptor?: string;
}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      customer: customerId,
      payment_method: paymentMethodId,
      description,
      metadata,
      statement_descriptor: statementDescriptor,
      confirm: true,
      off_session: true,
    });

    if (paymentIntent.status === "succeeded") {
      log.info("Payment succeeded", {
        paymentIntentId: paymentIntent.id,
        customerId,
        amount,
        metadata,
      });
      return paymentIntent;
    } else {
      throw new Error(`Payment failed with status: ${paymentIntent.status}`);
    }
  } catch (error: any) {
    log.error("Error processing payment:", error, {
      customerId,
      amount,
      description,
      metadata,
    });
    return { error: error.message };
  }
};

export const createAndPayTransactionWithToken = async ({
  customerId,
  amount,
  description,
  metadata,
  statementDescriptor,
  confirmationTokenId,
  receiptEmail,
}: {
  customerId: string;
  amount: number;
  description: string;
  metadata?: Record<string, string>;
  statementDescriptor?: string;
  confirmationTokenId: string;
  receiptEmail?: string;
}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      confirm: true,
      customer: customerId,
      amount: amount * 100,
      currency: "usd",
      description,
      statement_descriptor: statementDescriptor,
      setup_future_usage: undefined,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
      confirmation_token: confirmationTokenId,
      metadata: metadata,
      receipt_email: receiptEmail,
    });

    if (paymentIntent.status === "succeeded") {
      log.info("Payment succeeded", {
        paymentIntentId: paymentIntent.id,
        customerId,
        amount,
        metadata,
      });
      return paymentIntent;
    } else {
      throw new Error(`Payment failed with status: ${paymentIntent.status}`);
    }
  } catch (error: any) {
    log.error("Error processing payment:", error, {
      customerId,
      amount,
      description,
      metadata,
    });
    return { error: error.message };
  }
};
