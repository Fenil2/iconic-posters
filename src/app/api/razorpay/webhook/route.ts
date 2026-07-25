import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { markOrderPaidByProviderOrder } from "@/server/actions/order";

/**
 * Razorpay webhook — server-to-server confirmation of payments.
 * Configure the endpoint URL + secret in the Razorpay dashboard.
 */
export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  if (!verifyWebhookSignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    const event = JSON.parse(body);
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const payment = event.payload?.payment?.entity;
      if (payment?.order_id && payment?.id) {
        await markOrderPaidByProviderOrder(payment.order_id, payment.id);
      }
    }
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Bad payload" }, { status: 400 });
  }
}
