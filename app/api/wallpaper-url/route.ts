import { buildWallpaperUrl } from "@/lib/buildWallpaperUrl";
import { validateWallpaperParams } from "@/lib/validateWallpaperParams";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown = {};

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const params = validateWallpaperParams(
    body && typeof body === "object" && !Array.isArray(body) ? body : {},
  );
  const origin = new URL(request.url).origin;

  return Response.json({
    url: buildWallpaperUrl(origin, params),
  });
}
