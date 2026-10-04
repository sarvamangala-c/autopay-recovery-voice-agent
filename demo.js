// Demo script to simulate voice agent behavior without making actual calls
// This is useful for testing the system without using Twilio credits

const customers = require('./customers.json');

console.log('=== Autopay Recovery Voice Agent Demo ===\n');
console.log('NOTE: Phone numbers are fictional placeholders (+15550000001 to +15550000010)');
console.log('To test with your own number, replace a phone number in customers.json\n');

customers.forEach((customer, index) => {
  console.log(`Customer ${index + 1}: ${customer.name} (${customer.id})`);
  console.log(`  Phone: ${customer.phone} (fictional placeholder)`);
  console.log(`  Amount: $${customer.amount.toFixed(2)}`);
  console.log(`  Due Date: ${customer.dueDate}`);
  console.log(`  Failed Reason: ${customer.failedReason}`);
  console.log(`  Payment Method: ${customer.paymentMethod}`);
  console.log(`  Attempts: ${customer.attempts}`);
  console.log('\n  Simulated Voice Message:');
  console.log(`  "Hello ${customer.name}. This is an automated call regarding your payment of $${customer.amount.toFixed(2)} that was due on ${customer.dueDate}. The payment failed because ${customer.failedReason}. Press 1 to process the payment now using your ${customer.paymentMethod}. Press 2 to schedule a payment for later. Press 3 to speak with a customer service representative."`);
  console.log('\n  ---\n');
});

console.log('Demo complete. To make actual calls:');
console.log('1. Configure your .env file with Twilio credentials');
console.log('2. Replace a customer phone number with your own number in customers.json');
console.log('3. Run: npm start');
console.log('4. Open http://localhost:3000 in your browser');
console.log('5. Click "Initiate Recovery Call" on the customer with your number');
