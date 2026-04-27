// Free reverse / forward geocoding via OpenStreetMap Nominatim.
// No API key required. Be respectful of usage policy: include a User-Agent.

const UA =
  process.env.NEXT_PUBLIC_APP_URL ?? "ecommerce-platform (self-hosted)";

export type GeocodeResult = {
  displayName: string;
  lat: number;
  lng: number;
};

export async function geocodeForward(
  query: string
): Promise<GeocodeResult | null> {
  if (!query.trim()) return null;
  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", query);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");
    const res = await fetch(url, {
      headers: { "User-Agent": UA, "Accept-Language": "en" },
      cache: "force-cache",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{
      display_name: string;
      lat: string;
      lon: string;
    }>;
    if (!data[0]) return null;
    return {
      displayName: data[0].display_name,
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } catch {
    return null;
  }
}

export async function geocodeReverse(
  lat: number,
  lng: number
): Promise<string | null> {
  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lng));
    url.searchParams.set("format", "json");
    url.searchParams.set("zoom", "10");
    const res = await fetch(url, {
      headers: { "User-Agent": UA, "Accept-Language": "en" },
      cache: "force-cache",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { display_name?: string };
    return data.display_name ?? null;
  } catch {
    return null;
  }
}
