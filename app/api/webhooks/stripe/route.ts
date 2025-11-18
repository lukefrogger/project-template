import { NextRequest, NextResponse } from "next/server";
import { log } from "@/services/logger";
import { stripe } from "@/services/stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  let event: any = {};

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature") as string;

    if (!signature || !webhookSecret) {
      log.warn("Missing stripe signature or webhook secret");
      return NextResponse.json({ error: "Missing stripe signature or webhook secret" }, { status: 400 });
    }

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      log.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    // const event: any = JSON.parse(body);

    switch (event.type) {
      case "payment_intent.succeeded":
        log.info(`Processing payment_intent.succeeded event for ${event.data.object.id}`);
        // TODO: Record payment in DB
        log.info(`payment_intent.succeeded event complete.`);
        break;

      case "payment_intent.processing":
        log.info(`Processing payment_intent.processing event for ${event.data.object.id}`);
        // TODO: Record processing payment in DB
        log.info(`payment_intent.processing event complete.`);
        break;

      case "payment_intent.payment_failed":
        log.info(`Processing payment_intent.payment_failed event for ${event.data.object.id}`);
        // TODO: Record failed payment in DB
        log.info(`payment_intent.payment_failed event complete.`);
        break;

      case "invoice.payment_failed":
        log.info(`Processing invoice.payment_failed event for ${event.data.object.id}`);
        // TODO: Record failed invoice/subscription in DB
        log.info(`invoice.payment_failed event complete.`);
        break;

      case "customer.subscription.created":
        log.info(`Processing customer.subscription.create event for ${event.data.object.id}`);
        // TODO: Record new subscription in DB
        log.info(`customer.subscription.create event complete.`);
        break;

      case "customer.subscription.updated":
        log.info(`Processing customer.subscription.updated event for ${event.data.object.id}`);
        // TODO: Update subscription in DB
        log.info(`customer.subscription.updated event complete.`);
        break;

      case "customer.subscription.deleted":
        log.info(`Processing customer.subscription.deleted event for ${event.data.object.id}`);
        // TODO: Cancel subscription in DB
        log.info(`customer.subscription.deleted event complete.`);
        break;

      case "payment_method.updated":
        log.info(`Processing payment_method.updated event for ${event.data.object.id}`);
        // TODO: Update payment method in DB
        log.info(`payment_method.updated event complete.`);
        break;

      case "payment_method.attached":
        log.info(`Processing payment_method.attached event for ${event.data.object.id}`);
        // TODO: Update payment method in DB
        log.info(`payment_method.attached event complete.`);
        break;

      case "charge.refunded":
        log.info(`Processing charge.refunded event for ${event.data.object.id}`);
        // TODO: Record refund in DB
        log.info(`charge.refunded event complete.`);
        break;

      default:
        log.info(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    log.error(`Error processing Stripe webhook`, error as Error, {
      message: error.message,
      event: { type: event.type, data: event.id, dataId: event.data?.object?.id },
    });
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
