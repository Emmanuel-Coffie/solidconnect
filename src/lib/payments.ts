import { createHmac, timingSafeEqual } from "node:crypto";
import { type Payment, mutate } from "./store";
export const checkoutProducts = {
  professional: {
    description: "Professional membership · one month",
    amount: 9900,
  },
  consultation: { description: "Business consultation", amount: 120000 },
  listing: { description: "Featured listing credit", amount: 4900 },
};
export function validSignature(
  body: string,
  signature: string | null,
  key: string,
) {
  if (!signature || !key || !/^[a-f0-9]{128}$/i.test(signature)) return false;
  return timingSafeEqual(
    Buffer.from(createHmac("sha512", key).update(body).digest("hex")),
    Buffer.from(signature),
  );
}
export const provider = {
  async initialize(payment: Payment, email: string, base: string) {
    if (payment.provider === "mock")
      return { url: `/checkout?reference=${payment.reference}` };
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: payment.amount,
        currency: payment.currency,
        reference: payment.reference,
        callback_url: `${base}/payment/success`,
        channels: ["card", "mobile_money"],
      }),
    });
    const body = await res.json();
    if (!res.ok || !body.status)
      throw new Error("Payment provider is unavailable. Please try again.");
    return { url: body.data.authorization_url as string };
  },
  async verify(payment: Payment) {
    if (payment.provider === "mock") return payment.status;
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(payment.reference)}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
        cache: "no-store",
      },
    );
    const result = await res.json();
    if (!res.ok || !result.status)
      throw new Error("We could not verify your payment yet. Please retry.");
    if (
      result.data.amount !== payment.amount ||
      result.data.currency !== payment.currency ||
      result.data.reference !== payment.reference
    )
      throw new Error("Payment details do not match. Contact support.");
    return result.data.status === "success"
      ? "success"
      : result.data.status === "failed"
        ? "failed"
        : "pending";
  },
};
export async function verifyAndSave(payment: Payment) {
  const status = await provider.verify(payment);
  return mutate((s) => {
    const p = s.payments.find((x) => x.id === payment.id)!;
    if (p.status !== "success") p.status = status;
    return p;
  });
}
