# Autopay Recovery Voice Agent

A voice agent system for recovering failed autopay payments using Twilio voice integration. This system automatically calls customers with failed payments and guides them through payment recovery options.

## Features

- **Automated Voice Calls**: Automatically calls customers with failed autopay payments
- **Interactive Voice Response (IVR)**: Customers can choose to:
  - Press 1: Process payment immediately
  - Press 2: Schedule payment for later
  - Press 3: Speak with customer service
- **Customer Management**: 10 fictional customer records with payment failure details
- **Web Dashboard**: Simple UI to view customers and initiate recovery calls
- **Call Logging**: Track all initiated calls with status and timestamps

## Architecture

- **Backend**: Node.js with Express
- **Voice Provider**: Twilio (using TwiML for voice flows)
- **Frontend**: Simple HTML/CSS/JavaScript dashboard
- **Data**: JSON file with customer records (in-memory storage for demo)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Twilio account (free tier works for testing)
- A phone number you control (for testing)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web server framework
- `twilio` - Twilio Node.js SDK
- `dotenv` - Environment variable management

### 2. Configure Twilio

#### Get Twilio Credentials

1. Sign up for a free Twilio account at https://www.twilio.com
2. Navigate to the Console Dashboard
3. Copy your **Account SID** and **Auth Token**
4. Purchase a phone number (or use the free trial number)

#### Set Up Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Twilio credentials:
```
TWILIO_ACCOUNT_SID=your_actual_account_sid
TWILIO_AUTH_TOKEN=your_actual_auth_token
TWILIO_PHONE_NUMBER=+15555555555
PORT=3000
```

**Note for Windows users:** If `cp` command doesn't work, manually copy `.env.example` to `.env` and edit it.

**Important:**
- Replace `your_actual_account_sid` with your Twilio Account SID
- Replace `your_actual_auth_token` with your Twilio Auth Token
- Replace `+15555555555` with your Twilio phone number (include country code)
- For testing, you can use your own phone number as the TWILIO_PHONE_NUMBER if using a trial account

### 3. Configure Your Phone Number (for Local Testing)

To test the voice agent locally, you need to make your server accessible to Twilio:

#### Option A: Use ngrok (Recommended for Testing)

1. Install ngrok: https://ngrok.com/download
2. Run ngrok to expose your local server:
```bash
ngrok http 3000
```
3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
4. Update the server code to use this URL for Twilio webhooks, OR
5. Set up Twilio phone number voice webhook to point to: `https://abc123.ngrok.io/voice`

#### Option B: Deploy to a Cloud Platform

Deploy to Heroku, Vercel, Railway, or any Node.js hosting platform to get a public URL.

### 4. Update Customer Phone Numbers (Optional)

The fictional customer records in `customers.json` use US phone numbers. For testing, you may want to replace these with a phone number you control:

Edit `customers.json` and replace the `phone` fields with your test number:
```json
{
  "phone": "+15551234567"  // Replace with your actual phone number
}
```

**Important Note:** Only use phone numbers you own or have explicit permission to call.

## Running the Application

### Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

### Access the Dashboard

Open your browser and navigate to:
```
http://localhost:3000
```
You will see:
- A list of 10 fictional customers with failed payments
- Status indicators showing server and Twilio configuration
- Call logs section (initially empty)

### Initiate a Recovery Call

1. Click the "Initiate Recovery Call" button on any customer card
2. The system will place a call to the customer's phone number
3. The customer will hear an automated message with payment recovery options
4. The call will be logged in the "Call Logs" section

## Voice Flow

When a customer answers the call, they will hear:

> "Hello [Customer Name]. This is an automated call regarding your payment of $[Amount] that was due on [Due Date]. The payment failed because [Failed Reason]. Press 1 to process the payment now using your [Payment Method]. Press 2 to schedule a payment for later. Press 3 to speak with a customer service representative."

### Customer Responses

- **Press 1**: System confirms payment processing and hangs up
- **Press 2**: System confirms payment scheduling and hangs up
- **Press 3**: System indicates connecting to customer service and hangs up
- **No input**: System repeats the message

## API Endpoints

### `GET /api/health`
Health check endpoint. Returns server status and Twilio configuration status.

### `GET /api/customers`
Returns all customer records.

### `POST /api/call`
Initiates a recovery call to a customer.

**Request Body:**
```json
{
  "customerId": "CUST001"
}
```

**Response:**
```json
{
  "success": true,
  "callSid": "CA1234567890",
  "status": "queued",
  "message": "Call initiated to John Smith at +15551234567"
}
```

### `GET /api/call-logs`
Returns all call logs.

### `GET /voice?customerId=XXX`
Twilio webhook endpoint that returns TwiML for the voice flow.

### `POST /handle-response`
Twilio webhook endpoint that handles customer button presses.

## Project Structure

```
razorpay/
├── server.js              # Main Express server with Twilio integration
├── customers.json         # Fictional customer records
├── package.json           # Node.js dependencies
├── .env.example           # Example environment variables
├── .env                   # Your actual environment variables (not in git)
├── public/
│   └── index.html         # Web dashboard UI
└── README.md              # This file
```

## Assumptions and Limitations

### Assumptions

1. **Twilio Account**: You have a Twilio account with sufficient credits or trial balance
2. **Phone Numbers**: Customer phone numbers are valid and can receive calls
3. **Server Accessibility**: For Twilio to reach your server, it must be publicly accessible (ngrok or cloud deployment)
4. **Payment Processing**: This is a demonstration - actual payment processing is not implemented
5. **Customer Service**: Pressing 3 for customer service only announces the connection (no actual routing)

### Limitations

1. **No Real Payment Processing**: The system does not actually process payments - it's a voice agent demonstration
2. **In-Memory Storage**: Call logs are stored in memory and will be lost on server restart
3. **No Database**: Customer data is stored in a JSON file (not suitable for production)
4. **No Authentication**: The dashboard has no authentication (anyone can access it)
5. **Twilio Trial Limits**: Free Twilio accounts have limitations on call duration and destinations
6. **Single Call at a Time**: The UI initiates calls sequentially (no bulk calling)
7. **No Retry Logic**: Failed calls are not automatically retried
8. **No SMS Confirmation**: The system mentions SMS confirmations but doesn't send them

### Security Considerations

1. **Never commit `.env` file**: The `.env` file contains sensitive credentials and should never be committed to version control
2. **Use Environment Variables**: Always use environment variables for sensitive data
3. **Secure Webhooks**: In production, validate Twilio webhook signatures
4. **Rate Limiting**: Add rate limiting to prevent abuse
5. **Authentication**: Add authentication to the dashboard and API endpoints

## Testing the End-to-End Flow

1. Start the server: `npm start`
2. If using ngrok, run: `ngrok http 3000`
3. Update your Twilio phone number's voice webhook to point to your ngrok URL + `/voice`
4. Open `http://localhost:3000` in your browser
5. Click "Initiate Recovery Call" on a customer
6. Answer the call on your phone
7. Follow the voice prompts and press 1, 2, or 3
8. Verify the call appears in the "Call Logs" section

## Troubleshooting

### "Twilio not configured" error
- Ensure `.env` file exists with valid TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN
- Restart the server after updating `.env`

### Call fails to initiate
- Check Twilio account has sufficient credits
- Verify TWILIO_PHONE_NUMBER is correct
- Ensure customer phone number is valid and in E.164 format (e.g., +15551234567)
- Check server logs for detailed error messages

### Twilio can't reach your server
- Ensure your server is publicly accessible (use ngrok for local testing)
- If using ngrok, copy the HTTPS URL (not HTTP)
- Verify Twilio webhook URL is correct

### Voice flow doesn't work
- Check that the `/voice` endpoint is accessible from Twilio
- Verify the customerId parameter is being passed correctly
- Check server logs for TwiML generation errors

## Production Deployment Considerations

For a production deployment, you would need to:

1. **Database**: Replace JSON file with a proper database (PostgreSQL, MongoDB, etc.)
2. **Authentication**: Add user authentication to the dashboard
3. **Payment Integration**: Integrate with actual payment gateway (Stripe, Razorpay, etc.)
4. **Webhook Security**: Validate Twilio webhook signatures
5. **Error Handling**: Add comprehensive error handling and logging
6. **Monitoring**: Add application monitoring and alerting
7. **Rate Limiting**: Implement rate limiting to prevent abuse
8. **Compliance**: Ensure compliance with telephony regulations (TCPA, GDPR, etc.)
9. **Bulk Calling**: Add support for batch calling multiple customers
10. **Retry Logic**: Implement automatic retry for failed calls
11. **SMS Integration**: Add actual SMS confirmations
12. **Customer Service Routing**: Integrate with actual customer service system
