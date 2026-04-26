import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Truck,
  Settings,
  Tags,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin?callbackUrl=/admin");
  if (session.user.role !== "admin") {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Access denied</h1>
        <p className="mt-2 text-sm text-gray-500">
          Your account does not have admin permissions. Ask an admin to add your
          email to <code>ADMIN_EMAILS</code>.
        </p>
      </div>
    );
  }

  const nav = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/categories", label: "Categories", icon: Tags },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/agencies", label: "Delivery agencies", icon: Truck },
    { href: "/admin/settings", label: "Shop settings", icon: Settings },
  ];

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr]">
      <aside className="h-fit rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
        <p className="px-2 pb-3 text-xs font-semibold uppercase text-gray-500">
          Admin panel
        </p>
        <nav className="space-y-1 text-sm">
          {nav.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <i.icon className="h-4 w-4" />
              {i.label}
            </Link>
          ))}
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}
