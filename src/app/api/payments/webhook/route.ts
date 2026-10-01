import { validSignature, verifyAndSave } from "@/lib/payments";
import { readStore } from "@/lib/store";
export async function POST(req: Request) {
  const raw = await req.text();
  if (
    !validSignature(
      raw,
      req.headers.get("x-paystack-signature"),
      process.env.PAYSTACK_SECRET_KEY ?? "",
    )
  )
    return new Response("Invalid signature", { status: 401 });
  try {
    const event = JSON.parse(raw);
    if (event.event === "charge.success") {
      const payment = (await readStore()).payments.find(
        (x) =>
          x.reference === event.data.reference && x.provider === "paystack",
      );
      if (payment) await verifyAndSave(payment);
    }
    return Response.json({ received: true });
  } catch {
    return new Response("Retry later", { status: 500 });
  }
}
