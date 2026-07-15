import Stripe from 'stripe';
import { requireEnv } from './env';

const apiKey = requireEnv('STRIPE_SECRET_KEY');


const stripe = new Stripe(apiKey);


export { stripe };
