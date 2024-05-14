require('dotenv').config();
const express = require('express');
const PayOS = require('@payos/node');
const fs = require('fs');
const path = require('path');

const clientID = process.env.CLIENT_ID;
const apiKey = process.env.API_KEY;
const checkSumKey = process.env.CHECKSUM_KEY;

const payos = new PayOS(clientID, apiKey, checkSumKey);
const app = express();
app.use(express.static('public'));
app.use(express.json());

let currentOrderCode = Number(fs.readFileSync(path.join(__dirname, 'orderCode.txt'), 'utf8'));

const YOUR_DOMAIN = 'http://localhost:3000';
app.post('/create-payment-link', async (req, res) => {
    const order = {
        amount: 10000,
        description: 'Thanh toan don hang',
        orderCode: currentOrderCode,
        returnUrl: `${YOUR_DOMAIN}/success.html`,
        cancelUrl: `${YOUR_DOMAIN}/cancel.html`,
    };
    currentOrderCode++; 
    fs.writeFileSync(path.join(__dirname, 'orderCode.txt'), currentOrderCode.toString());
    const paymentLink = await payos.createPaymentLink(order);
    res.redirect(303, paymentLink.checkoutUrl);
})

app.post('/receive-hook', async (req, res) => {
    console.log(req.body);
    res.json();
});

app.listen(3000, () => console.log('Server is running on port 3000'));
