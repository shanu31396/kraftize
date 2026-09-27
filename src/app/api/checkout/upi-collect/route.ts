import { NextResponse } from "next/server";
// @ts-ignore
import Razorpay from "razorpay";
import prisma from "@/lib/prisma";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function POST(req: Request) {
  try {
    const { upiId, amount, orderId } = await req.json();

    // 1. We create the order in Razorpay (in paise)
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: orderId || `kw_${Date.now()}`,
    });

    // 2. THIS IS THE MAGIC: Server-to-Server UPI Collect Request
    // This directly pings NPCI to send a push notification to the user's PhonePe/GPay app
    // @ts-ignore
    const payment = await razorpay.payments.createUpi({
      amount: order.amount,
      currency: "INR",
      order_id: order.id,
      method: "upi",
      upi: {
        flow: "collect",
        vpa: upiId, // e.g., 9876543210@ybl
      },
    });

    // Save the pending order to our database here to track it...

    return NextResponse.json({ 
      success: true, 
      razorpayOrderId: order.id,
      message: "Push notification sent to phone successfully" 
    });

  } catch (error: any) {
    console.error("UPI Collect Error:", error);
    return NextResponse.json(
      { error: error.error?.description || "Failed to send payment request" }, 
      { status: 500 }
    );
  }
}