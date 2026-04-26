import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { deliveryAgencies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getShopConfig } from "@/lib/shop";
import { CheckoutForm } from "./CheckoutForm";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/checkout");
  }

  const [agencies, config] = await Promise.all([
    db
      .select()
      .from(deliveryAgencies)
      .where(eq(deliveryAgencies.active, true)),
    getShopConfig(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <CheckoutForm
        user={{
          name: session.user.name ?? "",
          email: session.user.email ?? "",
        }}
        agencies={agencies}
        config={config}
      />
    </div>
  );
}
