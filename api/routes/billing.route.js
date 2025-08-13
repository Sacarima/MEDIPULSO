// routes/billing.route.js
import express from 'express';
import 'dotenv/config';                 // ensure env is loaded for this module
import Stripe from 'stripe';

const router = express.Router();

// Guard: make it obvious if the key isn't set
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('[stripe] Missing STRIPE_SECRET_KEY – check your .env and env loading order.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Map our plan+cycle to Stripe price IDs (from env)
const PRICE_MAP = {
  plus: {
    monthly: process.env.STRIPE_PRICE_PLUS_MONTHLY,
    yearly:  process.env.STRIPE_PRICE_PLUS_YEARLY,
  },
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    yearly:  process.env.STRIPE_PRICE_PRO_YEARLY,
  },
  // free has no price
};

// POST /api/billing/checkout
// Body: { planId: 'plus'|'pro'|'free', cycle: 'monthly'|'yearly', doctorId?: string }
router.post('/checkout', async (req, res) => {
  try {
    const { planId, cycle = 'monthly', doctorId } = req.body || {};
    if (!planId) return res.status(400).json({ error: 'Missing planId' });

    // Free plan → no checkout; you could just store “free” in DB and return
    if (planId === 'free') {
      return res.json({ url: `${CLIENT_URL}/doctor-profile-info?billing=free` });
    }

    const price = PRICE_MAP?.[planId]?.[cycle];
    if (!price) {
      return res.status(400).json({ error: 'Unknown plan/cycle or missing price ID' });
    }

    // If you have auth middleware that sets req.user, you can set the email:
    const customerEmail = req.user?.email; // Optional

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price, quantity: 1 }],
      ...(customerEmail ? { customer_email: customerEmail } : {}),
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      automatic_tax: { enabled: true },
      client_reference_id: doctorId || undefined,
      metadata: { planId, cycle, doctorId: doctorId || '' },
      success_url: `${CLIENT_URL}/doctor-profile-info?billing=success`,
      cancel_url: `${CLIENT_URL}/doctor-profile-info?billing=cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('[stripe] checkout error:', err);
    res.status(500).json({ error: 'Unable to start checkout' });
  }
});

// POST /api/billing/portal
// Body: { customerId?: string }
router.post('/portal', async (req, res) => {
  try {
    const { customerId } = req.body || {};
    if (!customerId) {
      return res.status(400).json({ error: 'Missing customerId (store this on the doctor record after first checkout)' });
    }
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${CLIENT_URL}/doctor-profile-info?billing=portal_return`,
    });
    res.json({ url: portal.url });
  } catch (err) {
    console.error('[stripe] portal error:', err);
    res.status(500).json({ error: 'Unable to open billing portal' });
  }
});

export default router;
