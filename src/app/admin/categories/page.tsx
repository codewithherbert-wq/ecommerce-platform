import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { CategoriesManager } from "./CategoriesManager";

export const dynamic = "force-dynamic";

export default async function AdminCategories() {
  const rows = await db
    .select()
    .from(categories)
    .orderBy(categories.sortOrder);
  return (
    <div>
      <h1 className="text-2xl font-bold">Categories</h1>
      <p className="mt-1 text-sm text-gray-500">
        Group products into categories shown on the shop page.
      </p>
      <CategoriesManager initial={rows} />
    </div>
  );
}
