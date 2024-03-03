import Stripe from 'stripe';

const apiKey = process.env.STRIPE_SECRET_KEY as string;
const customerId = process.env.STRIPE_CUSTOMER_ID as string;


const stripe = new Stripe(apiKey, {
  apiVersion: '2023-10-16',
});


export { stripe , customerId };
