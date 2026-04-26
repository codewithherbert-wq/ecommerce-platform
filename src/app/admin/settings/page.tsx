import { getShopConfig } from "@/lib/shop";
import { SettingsForm } from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettings() {
  const config = await getShopConfig();
  return (
    <div>
      <h1 className="text-2xl font-bold">Shop settings</h1>
      <p className="mt-1 text-sm text-gray-500">
        Re-brand your store — change the name, hero, theme colors, logo, and
        more. Customers will see the changes immediately.
      </p>
      <SettingsForm config={config} />
    </div>
  );
}
