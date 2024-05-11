const express = require('express');
const PayOS = require('@payos/node');
const fs = require('fs');
const path = require('path');

const payos = new PayOS(
    'e682260b-0fcf-4b3d-bf4c-95c66681c569', 
    '7d445452-a61e-45e2-a71a-9d29b3ad0d8c', 
    'cdffa17bb649ae161aa5fc9f27e192d8c58f0f66d717b7bb197fae5e93501b23'
);
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

// webhook-url https using ngrok
// https://535b-2402-800-6344-d9c-60bb-b48f-460d-2370.ngrok-free.app/receive-hook
app.post('/receive-hook', async (req, res) => {
    console.log(req.body);
    res.json();
});

app.listen(3000, () => console.log('Server is running on port 3000'));
