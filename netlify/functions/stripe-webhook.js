const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase with service role key for admin access
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;

  try {
    // Verify webhook signature
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Webhook Error: ${err.message}` }),
    };
  }

  // Handle the event
  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      const session = stripeEvent.data.object;
      
      // Only process paid sessions
      if (session.payment_status !== 'paid') {
        console.log('Session not paid, skipping:', session.id);
        break;
      }

      const userId = session.metadata?.user_id;
      const email = session.metadata?.email || session.customer_email;

      console.log('Processing payment for:', { userId, email });

      // Update premium status by user_id (primary)
      if (userId) {
        const { error } = await supabase
          .from('profiles')
          .update({ is_premium: true })
          .eq('id', userId);

        if (error) {
          console.error('Failed to update premium by user_id:', error);
        } else {
          console.log('Successfully upgraded user:', userId);
        }
      }

      // Also try by email as fallback
      if (email) {
        const { error } = await supabase
          .from('profiles')
          .update({ is_premium: true })
          .eq('email', email);

        if (error) {
          console.error('Failed to update premium by email:', error);
        } else {
          console.log('Successfully upgraded user by email:', email);
        }
      }

      break;
    }

    case 'payment_intent.succeeded': {
      // Log for debugging, but main logic is in checkout.session.completed
      console.log('Payment intent succeeded:', stripeEvent.data.object.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${stripeEvent.type}`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};
