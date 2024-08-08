// webhookRoutes.js
import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = Stripe("sk_test_51Pbya8RoC4Hvexv47rsi462KBkvMXwzNQyREjDLAGVXiwtHihRiEZiSFWqr6Tn9qYRojJvBT5gj1I27aWIaGtC9N00yBBQcKvi");
const endpointSecret = "whsec_51d51f68d15ec9bae07f7550396b9121c39c8b05048ba11f85fb2f137bd310f7";

router.use(express.raw({ type: "application/json" }));

router.post('/webhook', (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    handleCheckoutSessionCompleted(session);
  }

  res.status(200).send();
});

function handleCheckoutSessionCompleted(session) {
  console.log("Payment was successful!");
  // Your existing logic here
}

export default router;
