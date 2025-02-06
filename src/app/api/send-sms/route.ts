import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json();

    const response = await client.messages.create({
      body: message + "\n\n If you had paid the amount, please ignore this message.\n\n Thank you.",
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    return NextResponse.json({ success: true, message: 'SMS sent successfully!', response });
  } catch (error: any) {
    console.error('Error sending SMS:', error);
    return NextResponse.json({ error: 'Failed to send SMS', status: 500 });
  }
}
