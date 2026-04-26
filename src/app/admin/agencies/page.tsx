import { db } from "@/lib/db";
import { deliveryAgencies } from "@/lib/db/schema";
import { AgenciesManager } from "./AgenciesManager";

export const dynamic = "force-dynamic";

export default async function AdminAgencies() {
  const rows = await db.select().from(deliveryAgencies);
  return (
    <div>
      <h1 className="text-2xl font-bold">Delivery agencies</h1>
      <p className="mt-1 text-sm text-gray-500">
        Customers will pick from these at checkout.
      </p>
      <AgenciesManager initial={rows} />
    </div>
  );
}
