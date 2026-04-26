import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  if (!product) notFound();
  const cats = await db.select().from(categories).orderBy(categories.sortOrder);

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit product</h1>
      <ProductForm product={product} categories={cats} />
    </div>
  );
}
