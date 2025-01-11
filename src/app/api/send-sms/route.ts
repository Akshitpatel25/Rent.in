import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { to, message } = reqBody;

    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });
    

    return NextResponse.json({ success: true, message: 'SMS sent successfully!', response });
  } catch (error: any) {
    console.error('Error sending SMS:', error);
    return NextResponse.json({ error: 'Failed to send SMS', status: 500 });
  }
}
