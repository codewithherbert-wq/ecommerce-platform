import type { ShopConfig } from "@/lib/db/schema";

// Server component that injects CSS custom properties driven by admin
// settings, so the whole UI re-themes when shop config changes.
export function ShopThemeStyles({ config }: { config: ShopConfig }) {
  const css = `:root { --shop-primary: ${config.primaryColor}; --shop-accent: ${config.accentColor}; }`;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
