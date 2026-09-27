import { NextResponse } from "next/server";
// @ts-ignore
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) return NextResponse.json({ error: "No order ID" }, { status: 400 });

  try {
    // Check Razorpay to see if the user has completed the payment on their phone
    const payments = await razorpay.orders.fetchPayments(orderId);
    
    // Look for a successful payment
    const successfulPayment = payments.items.find(p => p.status === "captured" || p.status === "authorized");

    if (successfulPayment) {
      return NextResponse.json({ status: "success" });
    }

    return NextResponse.json({ status: "pending" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}