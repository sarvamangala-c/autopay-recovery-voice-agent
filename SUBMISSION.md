# Voice Agent for Autopay Recovery - Submission

## Project Overview

A complete voice agent system for recovering failed autopay payments using Twilio voice integration. The system includes a web dashboard, 10 fictional customer records, and interactive voice response (IVR) functionality.

## Technology Stack

- **Voice Provider**: Twilio (using TwiML for voice flows)
- **Backend**: Node.js with Express
- **Frontend**: HTML/CSS/JavaScript (no framework dependencies)
- **Data Storage**: JSON file (in-memory for demonstration)

## Project Files

```
razorpay/
├── server.js              # Express server with Twilio integration
├── customers.json         # 10 fictional customer records (placeholder phone numbers)
├── demo.js                # Demo script to simulate voice messages
├── package.json           # Node.js dependencies and scripts
├── .env.example           # Environment variable template
├── .gitignore             # Git ignore file
├── README.md              # Comprehensive documentation
├── QUICKSTART.md          # Windows-specific quick start guide
├── SUBMISSION.md          # This file
└── public/
    └── index.html         # Web dashboard UI
```

## Setup and Run Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm
- Twilio account (free tier works for testing)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
```bash
# Copy the example file
copy .env.example .env  # Windows
# or
cp .env.example .env    # Mac/Linux
```

3. **Add Twilio credentials to .env:**
```
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
PORT=3000
```

Get credentials from: https://console.twilio.com

### Running the Demo (Simulation)

To see the voice agent behavior without making actual calls:

```bash
npm run demo
```

This displays all 10 customers with their simulated voice messages.

### Running the Server

```bash
npm start
```

The server will start on http://localhost:3000

### Accessing the Dashboard

Open your browser and navigate to:
```
http://localhost:3000
```

You will see:
- 10 fictional customer records
- Status indicators (server and Twilio configuration)
- Call logs section

### Making Actual Calls (Optional)

To make actual voice calls:

1. **Configure ngrok** (to make localhost accessible to Twilio):
```bash
ngrok http 3000
```

2. **Update Twilio webhook**:
   - Copy the ngrok HTTPS URL (e.g., https://abc123.ngrok.io)
   - In Twilio Console, go to your phone number settings
   - Set Voice Webhook to: `https://abc123.ngrok.io/voice`
   - Set Webhook HTTP method to: `GET`

3. **Update customer phone number** (use only numbers you control):
   - Edit `customers.json`
   - Replace a customer's phone number with your own number
   - Example: `"phone": "+15551234567"` (your actual number)

4. **Initiate a call**:
   - In the dashboard, click "Initiate Recovery Call"
   - Answer the call on your phone
   - Follow the voice prompts (press 1, 2, or 3)

## Voice Flow

When a customer answers, they hear:

> "Hello [Customer Name]. This is an automated call regarding your payment of $[Amount] that was due on [Due Date]. The payment failed because [Failed Reason]. Press 1 to process the payment now using your [Payment Method]. Press 2 to schedule a payment for later. Press 3 to speak with a customer service representative."

**Customer Options:**
- **Press 1**: System confirms payment processing and hangs up
- **Press 2**: System confirms payment scheduling and hangs up
- **Press 3**: System indicates connecting to customer service and hangs up
- **No input**: System repeats the message

## 10 Fictional Customer Records

The system includes 10 fictional customers with diverse payment failure scenarios:

| ID | Name | Amount | Due Date | Failed Reason | Payment Method | Attempts |
|----|------|--------|----------|---------------|----------------|----------|
| CUST001 | John Smith | $125.50 | 2026-10-01 | Insufficient funds | Visa ending in 4242 | 1 |
| CUST002 | Sarah Johnson | $89.99 | 2026-10-02 | Card expired | Mastercard ending in 5555 | 2 |
| CUST003 | Michael Brown | $250.00 | 2026-10-01 | Bank declined | Visa ending in 1234 | 1 |
| CUST004 | Emily Davis | $45.75 | 2026-10-03 | Payment method not on file | None | 0 |
| CUST005 | David Wilson | $175.25 | 2026-10-02 | Insufficient funds | Amex ending in 1001 | 3 |
| CUST006 | Jessica Martinez | $99.99 | 2026-10-01 | Card expired | Visa ending in 9876 | 1 |
| CUST007 | Robert Garcia | $320.50 | 2026-10-03 | Bank declined | Mastercard ending in 2468 | 2 |
| CUST008 | Amanda Lee | $67.50 | 2026-10-02 | Insufficient funds | Visa ending in 1357 | 1 |
| CUST009 | Christopher Taylor | $210.00 | 2026-10-01 | Payment method not on file | None | 0 |
| CUST010 | Michelle Anderson | $145.75 | 2026-10-03 | Card expired | Mastercard ending in 8642 | 2 |

**Note:** Phone numbers are fictional placeholders (+15550000001 to +15550000010). To test with actual calls, replace with a number you control.

## End-to-End Demonstration

### Demo Mode (No Twilio Required)

The demo script demonstrates the complete voice agent behavior without requiring Twilio credentials or making actual calls:

```bash
npm run demo
```

Output shows:
- All 10 customer records
- Their payment details
- The exact voice message each customer would receive
- Instructions for making actual calls

### Full End-to-End (With Twilio)

1. **Setup**: Configure Twilio credentials in `.env`
2. **Start Server**: Run `npm start`
3. **Expose Server**: Use ngrok to make localhost public
4. **Configure Webhook**: Set Twilio phone number webhook to ngrok URL
5. **Update Phone Number**: Replace a customer's phone with your own
6. **Initiate Call**: Click "Initiate Recovery Call" in dashboard
7. **Answer Call**: Receive the automated voice message
8. **Respond**: Press 1, 2, or 3 on your phone
9. **Verify**: Check call logs in dashboard

## Assumptions

1. **Twilio Account**: User has a Twilio account with sufficient credits or trial balance
2. **Phone Numbers**: For actual calls, user will replace fictional numbers with numbers they control
3. **Server Accessibility**: For Twilio webhooks, user will use ngrok or deploy to cloud
4. **Payment Processing**: This is a demonstration - actual payment processing is not implemented
5. **Customer Service**: Pressing 3 for customer service only announces the connection (no actual routing)

## Limitations

1. **No Real Payment Processing**: The system does not actually process payments - it's a voice agent demonstration
2. **In-Memory Storage**: Call logs are stored in memory and lost on server restart
3. **No Database**: Customer data is stored in a JSON file (not suitable for production)
4. **No Authentication**: The dashboard has no authentication (anyone can access it)
5. **Twilio Trial Limits**: Free Twilio accounts have limitations on call duration and destinations
6. **Single Call at a Time**: The UI initiates calls sequentially (no bulk calling)
7. **No Retry Logic**: Failed calls are not automatically retried
8. **No SMS Confirmation**: The system mentions SMS confirmations but doesn't send them
9. **Fictional Phone Numbers**: Customer phone numbers are placeholders (+15550000001 to +15550000010)

## Security Considerations

1. **No Credentials in Repository**: No real API keys, passwords, or credentials are included in the code
2. **.env is in .gitignore**: The `.env` file is excluded from version control
3. **Placeholder Values**: All sensitive data in `.env.example` are placeholders
4. **User Must Add Credentials**: User must add their own Twilio credentials to make actual calls
5. **Phone Number Safety**: User must only call numbers they control or have permission to call

## API Endpoints

- `GET /api/health` - Health check and configuration status
- `GET /api/customers` - Get all customer records
- `POST /api/call` - Initiate a recovery call
- `GET /api/call-logs` - Get call history
- `GET /voice?customerId=XXX` - Twilio webhook for voice flow
- `POST /handle-response` - Twilio webhook for customer responses

## Dependencies

- `express` (^5.2.1) - Web server framework
- `twilio` (^6.1.2) - Twilio Node.js SDK
- `dotenv` (^18.0.5) - Environment variable management

## Testing the System

### Quick Test (Demo Mode)
```bash
npm run demo
```

### Full Test (With Twilio)
```bash
# 1. Configure .env with Twilio credentials
# 2. Replace a customer phone number with your own
# 3. Start server
npm start

# 4. In another terminal, start ngrok
ngrok http 3000

# 5. Configure Twilio webhook with ngrok URL
# 6. Open http://localhost:3000
# 7. Click "Initiate Recovery Call"
# 8. Answer your phone and test the IVR
```

## Production Deployment Considerations

For production use, the following would be needed:

1. **Database**: Replace JSON file with PostgreSQL, MongoDB, etc.
2. **Authentication**: Add user authentication to dashboard
3. **Payment Integration**: Integrate with actual payment gateway
4. **Webhook Security**: Validate Twilio webhook signatures
5. **Error Handling**: Comprehensive error handling and logging
6. **Monitoring**: Application monitoring and alerting
7. **Rate Limiting**: Prevent abuse
8. **Compliance**: Ensure compliance with telephony regulations (TCPA, GDPR, etc.)
9. **Bulk Calling**: Support for batch calling multiple customers
10. **Retry Logic**: Automatic retry for failed calls
11. **SMS Integration**: Actual SMS confirmations
12. **Customer Service Routing**: Integration with actual customer service system

## License

ISC

## Contact

For issues or questions, refer to:
- Twilio documentation: https://www.twilio.com/docs
- Express documentation: https://expressjs.com/
