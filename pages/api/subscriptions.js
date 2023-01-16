const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async function customerSubscriptions(req, res) {
  const { email } = JSON.parse(req.body);
  const user = await stripe.customers.list({
    email,
  });
  const id = user?.data?.[0]?.id;
  if (id) {
    const subscriptions = await stripe.subscriptions.list({
      customer: id
    })
    const status = subscriptions?.data?.[0]?.status;
    if (status === 'active') {
      res.status(200).json({ status: 'active' });
      return;
    }
  }
  res.status(200).json({ status: 'inactive' });
}