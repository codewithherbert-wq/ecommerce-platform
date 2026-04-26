import crypto from "node:crypto";

const API_URL = "https://api.commerce.coinbase.com";

export const hasCoinbase = Boolean(process.env.COINBASE_COMMERCE_API_KEY);

type CreateChargeArgs = {
  name: string;
  description: string;
  amount: number; // in major units, e.g. 12.50
  currency: string;
  orderId: string;
  redirectUrl: string;
  cancelUrl: string;
};

type CoinbaseCharge = {
  id: string;
  code: string;
  hosted_url: string;
  expires_at: string;
};

export async function createCoinbaseCharge(
  args: CreateChargeArgs
): Promise<CoinbaseCharge> {
  const key = process.env.COINBASE_COMMERCE_API_KEY;
  if (!key) {
    throw new Error("COINBASE_COMMERCE_API_KEY is not configured");
  }
  const res = await fetch(`${API_URL}/charges`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CC-Api-Key": key,
      "X-CC-Version": "2018-03-22",
    },
    body: JSON.stringify({
      name: args.name,
      description: args.description,
      pricing_type: "fixed_price",
      local_price: { amount: args.amount.toFixed(2), currency: args.currency },
      metadata: { order_id: args.orderId },
      redirect_url: args.redirectUrl,
      cancel_url: args.cancelUrl,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Coinbase Commerce error: ${res.status} ${body}`);
  }
  const json = (await res.json()) as { data: CoinbaseCharge };
  return json.data;
}

export function verifyCoinbaseSignature(
  rawBody: string,
  signature: string | null
): boolean {
  const secret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const computed = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(computed, "hex"),
      Buffer.from(signature, "hex")
    );
  } catch {
    return false;
  }
}
