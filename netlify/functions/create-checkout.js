import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { userId, email, successUrl, cancelUrl } = JSON.parse(event.body);

    if (!userId || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing userId or email' }),
      };
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      metadata: {
        user_id: userId,
        email: email,
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'SpendBot Premium',
              description: 'Lifetime access to SpendBot Premium features',
              images: ['https://spendbot.netlify.app/icon-512.png'],
            },
            unit_amount: 499, // $4.99 in cents
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId: session.id }),
    };
  } catch (error) {
    console.error('Create checkout error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
