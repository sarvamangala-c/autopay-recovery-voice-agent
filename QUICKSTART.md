# Quick Start Guide (Windows)

This guide helps you get the voice agent running quickly on Windows.

## Prerequisites

1. Node.js installed (https://nodejs.org)
2. Twilio account (https://www.twilio.com)

## Setup Steps

### 1. Install Dependencies

Open Command Prompt or PowerShell in the project directory and run:

```cmd
npm install
```

### 2. Configure Environment Variables

**Option A: Using Command Prompt**

```cmd
copy .env.example .env
notepad .env
```

**Option B: Using PowerShell**

```powershell
Copy-Item .env.example .env
notepad .env
```

**Option C: Manually**

1. Open `.env.example` in a text editor
2. Save it as `.env` in the same directory
3. Edit the `.env` file with your Twilio credentials

### 3. Get Twilio Credentials

1. Log in to your Twilio Console (https://console.twilio.com)
2. Copy your **Account SID** from the dashboard
3. Click "Show" to reveal and copy your **Auth Token**
4. Buy or verify a phone number in the Twilio Console

### 4. Update .env File

Replace the placeholder values in `.env`:

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_actual_auth_token_here
TWILIO_PHONE_NUMBER=+15555555555
PORT=3000
```

### 5. Run the Demo (Optional)

To see the simulated voice messages without making actual calls:

```cmd
npm run demo
```

### 6. Start the Server

```cmd
npm start
```

You should see:
```
Voice agent server running on http://localhost:3000
Twilio configured: true
```

### 7. Access the Dashboard

Open your browser and navigate to:
```
http://localhost:3000
```

### 8. Make Your Server Public (Required for Twilio)

Twilio needs to reach your server. Use ngrok:

1. Download ngrok from https://ngrok.com/download
2. Extract and run ngrok:
```cmd
ngrok http 3000
```
3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
4. In Twilio Console, go to your phone number settings
5. Set the Voice Webhook to: `https://abc123.ngrok.io/voice`
6. Set Webhook HTTP method to: `GET`

### 9. Test the Voice Agent

1. In the dashboard, click "Initiate Recovery Call" on any customer
2. Answer the call on your phone
3. Follow the voice prompts (press 1, 2, or 3)
4. Check the "Call Logs" section to see the call record

## Troubleshooting

### "Twilio not configured" error
- Ensure `.env` file exists in the project root
- Verify TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are correct
- Restart the server after updating `.env`

### Call fails to initiate
- Check Twilio account has credits
- Verify phone numbers are in E.164 format (+15551234567)
- Check the server console for error messages

### Twilio can't reach your server
- Ensure ngrok is running
- Use the HTTPS URL from ngrok (not HTTP)
- Verify the webhook URL in Twilio Console

## Testing with Your Own Number

To test with your own phone number:

1. Edit `customers.json`
2. Replace a customer's phone number with your number:
```json
{
  "id": "CUST001",
  "name": "Test Customer",
  "phone": "+15551234567",  // Replace with your number
  ...
}
```
3. Save the file
4. Restart the server
5. Initiate a call to that customer

**Important:** Only use phone numbers you own or have explicit permission to call.

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Review the [API endpoints](README.md#api-endpoints)
- Check [assumptions and limitations](README.md#assumptions-and-limitations)
