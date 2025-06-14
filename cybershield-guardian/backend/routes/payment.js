import express from 'express';
import Stripe from 'stripe';
import { verifyUser } from '../middleware/authMiddleware.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create payment intent
router.post('/create-payment-intent', verifyUser, async (req, res) => {
  const { amount, currency = 'usd' } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'],
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment intent', error });
  }
});

export default router;
