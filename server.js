require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Load customer data
const customers = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'customers.json'), 'utf8')
);

// Store call logs in memory (in production, use a database)
const callLogs = [];

app.use(express.json());
app.use(express.static('public'));

// Generate TwiML for the voice flow
function generateVoiceTwiML(customer) {
  const voiceResponse = new twilio.twiml.VoiceResponse();

  const gather = voiceResponse.gather({
    numDigits: 1,
    action: `/handle-response?customerId=${customer.id}`,
    method: 'POST',
    timeout: 10
  });

  gather.say(
    `Hello ${customer.name}. This is an automated call regarding your payment of $${customer.amount.toFixed(2)} that was due on ${customer.dueDate}. ` +
    `The payment failed because ${customer.failedReason}. ` +
    `Press 1 to process the payment now using your ${customer.paymentMethod}. ` +
    `Press 2 to schedule a payment for later. ` +
    `Press 3 to speak with a customer service representative.`
  );

  // If no input, repeat the message
  voiceResponse.redirect(`/voice?customerId=${customer.id}`);

  return voiceResponse.toString();
}

// Generate TwiML for handling the response
function generateResponseTwiML(customer, digit) {
  const voiceResponse = new twilio.twiml.VoiceResponse();

  if (digit === '1') {
    // Process payment
    voiceResponse.say(
      `Thank you, ${customer.name}. We are processing your payment of $${customer.amount.toFixed(2)} now. ` +
      `You will receive a confirmation SMS shortly. Goodbye.`
    );
    voiceResponse.hangup();
  } else if (digit === '2') {
    // Schedule payment
    voiceResponse.say(
      `Thank you, ${customer.name}. Your payment has been scheduled. ` +
      `We will attempt to process it again in 3 business days. Goodbye.`
    );
    voiceResponse.hangup();
  } else if (digit === '3') {
    // Connect to customer service
    voiceResponse.say('Connecting you to a customer service representative now.');
    voiceResponse.hangup();
  } else {
    // Invalid input
    voiceResponse.say('Invalid selection. Please try again.');
    voiceResponse.redirect(`/voice?customerId=${customer.id}`);
  }

  return voiceResponse.toString();
}

// Endpoint to initiate a call
app.post('/api/call', async (req, res) => {
  try {
    const { customerId } = req.body;

    const customer = customers.find(c => c.id === customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Check if Twilio credentials are configured
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      return res.status(500).json({
        error: 'Twilio credentials not configured',
        message: 'Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env file'
      });
    }

    const call = await twilioClient.calls.create({
      to: customer.phone,
      from: process.env.TWILIO_PHONE_NUMBER,
      url: `${req.protocol}://${req.get('host')}/voice?customerId=${customer.id}`,
      method: 'GET'
    });

    // Log the call
    callLogs.push({
      customerId: customer.id,
      customerName: customer.name,
      callSid: call.sid,
      status: call.status,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      callSid: call.sid,
      status: call.status,
      message: `Call initiated to ${customer.name} at ${customer.phone}`
    });
  } catch (error) {
    console.error('Error initiating call:', error);
    res.status(500).json({
      error: 'Failed to initiate call',
      message: error.message
    });
  }
});

// Endpoint to handle voice webhook (TwiML generation)
app.get('/voice', (req, res) => {
  const { customerId } = req.query;
  const customer = customers.find(c => c.id === customerId);

  if (!customer) {
    res.status(404).send('Customer not found');
    return;
  }

  const twiml = generateVoiceTwiML(customer);
  res.type('text/xml');
  res.send(twiml);
});

// Endpoint to handle user response
app.post('/handle-response', (req, res) => {
  const { customerId, Digits } = req.body;
  const customer = customers.find(c => c.id === customerId);

  if (!customer) {
    res.status(404).send('Customer not found');
    return;
  }

  const twiml = generateResponseTwiML(customer, Digits);
  res.type('text/xml');
  res.send(twiml);
});

// Endpoint to get all customers
app.get('/api/customers', (req, res) => {
  res.json(customers);
});

// Endpoint to get call logs
app.get('/api/call-logs', (req, res) => {
  res.json(callLogs);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    twilioConfigured: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)
  });
});

app.listen(PORT, () => {
  console.log(`Voice agent server running on http://localhost:${PORT}`);
  console.log(`Twilio configured: ${!!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)}`);
});
