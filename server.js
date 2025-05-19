const express = require('express');
const stripe = require('stripe')('YOUR_SECRET_KEY'); // Replace with your Stripe secret key
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Clean URL routes
app.get('/cleaning', (req, res) => {
    res.sendFile(path.join(__dirname, 'cleaning.html'));
});

// Store waitlist entries (in a real app, use a database)
const waitlist = [];

app.post('/api/create-waitlist', async (req, res) => {
    try {
        const { payment_method_id, email, name, company } = req.body;

        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1000, // $10.00 in cents
            currency: 'usd',
            payment_method: payment_method_id,
            confirm: true,
            return_url: `${req.protocol}://${req.get('host')}/success.html`,
        });

        if (paymentIntent.status === 'succeeded') {
            // Add to waitlist
            waitlist.push({
                email,
                name,
                company,
                paymentId: paymentIntent.id,
                timestamp: new Date().toISOString()
            });

            res.json({ success: true });
        } else {
            res.json({ success: false, error: 'Payment failed' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 