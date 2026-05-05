import { WallpaperParams } from "./validateWallpaperParams";

export function buildWallpaperUrl(origin: string, params: WallpaperParams) {
  const url = new URL("/api/wallpaper", origin);

  url.searchParams.set("birth", params.birth);
  url.searchParams.set("life", String(params.life));
  url.searchParams.set("filled", params.filled);
  url.searchParams.set("empty", params.empty);
  url.searchParams.set("bg", params.bg);
  url.searchParams.set("cell", String(params.cell));
  url.searchParams.set("gap", String(params.gap));
  url.searchParams.set("layout", params.layout);
  url.searchParams.set("width", String(params.width));
  url.searchParams.set("height", String(params.height));

  return url.toString();
}
