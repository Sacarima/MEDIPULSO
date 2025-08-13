import Stripe from "stripe";
import DoctorForm from "../models/doctorForm.model.js";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" })

// Use TEST secret locally (from `stripe listen …`) and LIVE in prod
const WEBHOOK_SECRET =
  process.env.NODE_ENV === "production"
    ? process.env.STRIPE_WEBHOOK_SECRET_LIVE
    : process.env.STRIPE_WEBHOOK_SECRET;


export default async function stripeWebhookHandler(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error("[stripe] webhook signature verify failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object;
        // capture identifiers
        const doctorId = s.client_reference_id || s.metadata?.doctorId;
        if (doctorId) {
          await DoctorForm.findByIdAndUpdate(
            doctorId,
            {
              $set: {
                stripeCustomerId: s.customer || null,
                stripeSubscriptionId: s.subscription || null,
                planId: s.metadata?.planId || null,
                planCycle: s.metadata?.cycle || null,
                planStatus: "active",
              },
            },
            { new: true }
          );
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object;
        const priceId = sub.items?.data?.[0]?.price?.id || null;

        await DoctorForm.findOneAndUpdate(
          { stripeCustomerId: sub.customer },
          {
            $set: {
              stripeSubscriptionId: sub.id,
              planPriceId: priceId,
              planStatus: sub.status, // trialing | active | past_due | canceled | incomplete…
              currentPeriodEnd: new Date(sub.current_period_end * 1000),
            },
          }
        );
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        await DoctorForm.findOneAndUpdate(
          { stripeCustomerId: sub.customer },
          { $set: { planStatus: "canceled" } }
        );
        break;
      }

      default:
        // Unhandled events are fine
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error("[stripe] webhook handler error:", err);
    res.status(500).json({ received: true });
  }
}