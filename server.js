const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')('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');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/process-payment', async (req, res) => {
    const { nonce, amount } = req.body;

    try {
        // Create a Stripe token from the Square nonce
        const token = await stripe.tokens.create({ card: { token: nonce } });

        // Charge the card using the Stripe token
        const charge = await stripe.charges.create({
            amount: amount, // amount in cents
            currency: 'usd',
            source: token.id,
            description: 'Example charge'
        });

        res.json({ success: true, charge });
    } catch (error) {
        console.error('Payment processing failed:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
