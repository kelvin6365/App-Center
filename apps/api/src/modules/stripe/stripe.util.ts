import Stripe from 'stripe';

export class StripeUtil {
  //Verify webhook signatures with official libraries
  verifyWebhookSignature(
    payload: string | Buffer,
    signature: string,
    secret: string,
    stripe: Stripe,
  ): Stripe.Event {
    return stripe.webhooks.constructEvent(payload, signature, secret);
  }
}
