export type WallpaperLayout = "single" | "double";

export type WallpaperParams = {
  birth: string;
  life: number;
  filled: string;
  empty: string;
  bg: string;
  cell: number;
  gap: number;
  layout: WallpaperLayout;
  width: number;
  height: number;
};

type WallpaperInput = Partial<{
  birth: unknown;
  life: unknown;
  filled: unknown;
  empty: unknown;
  bg: unknown;
  cell: unknown;
  gap: unknown;
  layout: unknown;
  width: unknown;
  height: unknown;
  birthDate: unknown;
  lifeYears: unknown;
  filledColor: unknown;
  emptyColor: unknown;
  backgroundColor: unknown;
  cellSize: unknown;
}>;

export const defaultWallpaperParams: WallpaperParams = {
  birth: "1990-01-01",
  life: 90,
  filled: "#f5f5f5",
  empty: "#3f3f46",
  bg: "#050505",
  cell: 8,
  gap: 2,
  layout: "single",
  width: 1179,
  height: 2556,
};

const hexColorPattern = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function valueFromSearch(searchParams: URLSearchParams): WallpaperInput {
  return {
    birth: searchParams.get("birth"),
    life: searchParams.get("life"),
    filled: searchParams.get("filled"),
    empty: searchParams.get("empty"),
    bg: searchParams.get("bg"),
    cell: searchParams.get("cell"),
    gap: searchParams.get("gap"),
    layout: searchParams.get("layout"),
    width: searchParams.get("width"),
    height: searchParams.get("height"),
  };
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function sanitizeDate(value: unknown) {
  const candidate = asString(value);

  if (!datePattern.test(candidate)) {
    return defaultWallpaperParams.birth;
  }

  const parsed = new Date(`${candidate}T00:00:00.000Z`);
  const valid =
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === candidate &&
    parsed.getUTCFullYear() >= 1900;

  return valid ? candidate : defaultWallpaperParams.birth;
}

function sanitizeInteger(value: unknown, fallback: number, min: number, max: number) {
  const candidate = asString(value).trim();
  const parsed = typeof value === "number" ? value : candidate ? Number(candidate) : fallback;

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.round(parsed)));
}

function sanitizeColor(value: unknown, fallback: string) {
  const candidate = asString(value).trim();
  const match = candidate.match(hexColorPattern);

  if (!match) {
    return fallback;
  }

  const hex = match[1].toLowerCase();

  if (hex.length === 3) {
    return `#${hex
      .split("")
      .map((character) => `${character}${character}`)
      .join("")}`;
  }

  return `#${hex}`;
}

function sanitizeLayout(value: unknown): WallpaperLayout {
  return value === "double" ? "double" : "single";
}

export function validateWallpaperParams(input: URLSearchParams | WallpaperInput): WallpaperParams {
  const source = input instanceof URLSearchParams ? valueFromSearch(input) : input;

  return {
    birth: sanitizeDate(source.birth ?? source.birthDate),
    life: sanitizeInteger(source.life ?? source.lifeYears, defaultWallpaperParams.life, 1, 120),
    filled: sanitizeColor(source.filled ?? source.filledColor, defaultWallpaperParams.filled),
    empty: sanitizeColor(source.empty ?? source.emptyColor, defaultWallpaperParams.empty),
    bg: sanitizeColor(source.bg ?? source.backgroundColor, defaultWallpaperParams.bg),
    cell: sanitizeInteger(source.cell ?? source.cellSize, defaultWallpaperParams.cell, 2, 40),
    gap: sanitizeInteger(source.gap, defaultWallpaperParams.gap, 0, 20),
    layout: sanitizeLayout(source.layout),
    width: sanitizeInteger(source.width, defaultWallpaperParams.width, 320, 7680),
    height: sanitizeInteger(source.height, defaultWallpaperParams.height, 320, 7680),
  };
}
