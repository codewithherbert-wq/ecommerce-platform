import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const cats = await db.select().from(categories).orderBy(categories.sortOrder);
  return (
    <div>
      <h1 className="text-2xl font-bold">New product</h1>
      <ProductForm categories={cats} />
    </div>
  );
}
