import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { formatMoney } from "@/lib/utils";
import { AddToCartButton } from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);
  const product = rows[0];
  if (!product || !product.active) notFound();

  const images =
    (product.images && product.images.length > 0
      ? product.images
      : [product.imageUrl].filter(Boolean)) as string[];

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
      <div>
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
          {images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {images.slice(1).map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt=""
                className="aspect-square w-full rounded object-cover"
              />
            ))}
          </div>
        )}
      </div>
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-2xl font-semibold">
            {formatMoney(product.priceCents, product.currency)}
          </span>
          {product.compareAtPriceCents &&
            product.compareAtPriceCents > product.priceCents && (
              <span className="text-sm text-gray-500 line-through">
                {formatMoney(product.compareAtPriceCents, product.currency)}
              </span>
            )}
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {product.stock > 0
            ? `${product.stock} in stock`
            : "Currently out of stock"}
        </p>
        <p className="mt-6 whitespace-pre-line text-sm leading-6 text-gray-700 dark:text-gray-300">
          {product.description}
        </p>

        <div className="mt-8">
          <AddToCartButton
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              priceCents: product.priceCents,
              imageUrl: product.imageUrl,
              stock: product.stock,
            }}
          />
        </div>
      </div>
    </div>
  );
}
