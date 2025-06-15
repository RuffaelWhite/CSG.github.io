import express from 'express';
import { verifyUser } from '../middleware/authMiddleware.js';
import Stripe from 'stripe';
import { STRIPE_API_KEY } from '../config.js';

const router = express.Router();
const stripe = new Stripe(STRIPE_API_KEY);

router.post('/create-payment-intent', verifyUser, async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
