import { WallpaperParams } from "./validateWallpaperParams";

const weeksPerYear = 52;
const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
const defaultAccentColor = "#f97316";

type CalendarGrid = {
  columns: number;
  rows: number;
  totalCells: number;
  cell: number;
  gap: number;
  width: number;
  height: number;
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function weeksBetweenBirthAndNow(birth: string, now: Date) {
  const birthDate = new Date(`${birth}T00:00:00.000Z`);
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  return Math.floor((todayUtc - birthDate.getTime()) / millisecondsPerWeek);
}

function getGridDimensions(options: {
  sectionYears: number;
  columns: number;
  cell: number;
  gap: number;
}): CalendarGrid {
  const totalCells = options.sectionYears * weeksPerYear;
  const columns = Math.min(options.columns, totalCells);
  const rows = Math.ceil(totalCells / columns);

  return {
    columns,
    rows,
    totalCells,
    cell: options.cell,
    gap: options.gap,
    width: columns * options.cell + Math.max(0, columns - 1) * options.gap,
    height: rows * options.cell + Math.max(0, rows - 1) * options.gap,
  };
}

function resolveCellSize(options: {
  columns: number;
  rows: number;
  availableWidth: number;
  availableHeight: number;
  preferredGap: number;
}) {
  const gap = Math.max(1, options.preferredGap);
  const widthLimitedCell =
    (options.availableWidth - Math.max(0, options.columns - 1) * gap) / options.columns;
  const heightLimitedCell =
    (options.availableHeight - Math.max(0, options.rows - 1) * gap) / options.rows;
  const fittedCell = Math.floor(Math.min(widthLimitedCell, heightLimitedCell));
  const cell = Math.max(2, fittedCell);

  return {
    cell,
    gap,
  };
}

function renderCells(options: {
  columns: number;
  totalCells: number;
  filledWeeks: number;
  currentWeek: number;
  startX: number;
  startY: number;
  cell: number;
  gap: number;
  filled: string;
  empty: string;
  current: string;
  offset: number;
}) {
  const cells: string[] = [];
  const radius = Math.max(2, options.cell / 2);

  for (let index = 0; index < options.totalCells; index += 1) {
    const absoluteIndex = options.offset + index;
    const centerX = options.startX + (index % options.columns) * (options.cell + options.gap) + radius;
    const centerY =
      options.startY + Math.floor(index / options.columns) * (options.cell + options.gap) + radius;
    const fill =
      absoluteIndex === options.currentWeek
        ? options.current
        : absoluteIndex < options.filledWeeks
          ? options.filled
          : options.empty;

    cells.push(
      `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="${escapeXml(fill)}" />`,
    );
  }

  return cells.join("");
}

export function generateLifeCalendarSvg(params: WallpaperParams, now = new Date()) {
  const totalWeeks = params.life * weeksPerYear;
  const livedWeeks = Math.min(totalWeeks, Math.max(0, weeksBetweenBirthAndNow(params.birth, now)));
  const currentWeek = Math.min(totalWeeks - 1, Math.max(0, livedWeeks));
  const width = params.width;
  const height = params.height;
  const padding = Math.max(42, Math.min(width, height) * 0.07);
  const topOffset = Math.max(300, height * 0.285);
  const bottomOffset = Math.max(180, height * 0.11);
  const availableWidth = width - padding * 2;
  const availableHeight = height - topOffset - bottomOffset;

  const sections =
    params.layout === "double"
      ? [Math.ceil(params.life / 2), Math.floor(params.life / 2)]
      : [params.life];

  const rowsForFit =
    params.layout === "double" ? Math.ceil(params.life / 2) * 2 + 3 : params.life;
  const fit = resolveCellSize({
    columns: weeksPerYear,
    rows: rowsForFit,
    availableWidth,
    availableHeight,
    preferredGap: params.gap,
  });
  const sectionGap = params.layout === "double" ? Math.max(fit.cell * 3, fit.gap * 8) : 0;
  const grids = sections.map((years) =>
    getGridDimensions({
      sectionYears: years,
      columns: weeksPerYear,
      cell: fit.cell,
      gap: fit.gap,
    }),
  );
  const totalGridHeight =
    grids.reduce((sum, grid) => sum + grid.height, 0) + sectionGap * Math.max(0, grids.length - 1);
  const startY = Math.max(topOffset, topOffset + (availableHeight - totalGridHeight) / 2);
  const progress = `${Math.round((livedWeeks / totalWeeks) * 1000) / 10}% complete`;
  const progressY = Math.min(height - Math.max(70, height * 0.055), startY + totalGridHeight + 48);
  const progressSize = Math.max(18, Math.min(28, width / 48));

  let offset = 0;
  let cursorY = startY;
  const renderedSections = grids
    .map((grid) => {
      const sectionX = Math.max(padding, (width - grid.width) / 2);
      const cells = renderCells({
        columns: grid.columns,
        totalCells: grid.totalCells,
        filledWeeks: livedWeeks,
        currentWeek,
        startX: sectionX,
        startY: cursorY,
        cell: grid.cell,
        gap: grid.gap,
        filled: params.filled,
        empty: params.empty,
        current: defaultAccentColor,
        offset,
      });

      cursorY += grid.height + sectionGap;
      offset += grid.totalCells;

      return cells;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Life calendar wallpaper">
  <rect width="100%" height="100%" fill="${escapeXml(params.bg)}" />
  ${renderedSections}
  <text x="${width / 2}" y="${progressY}" text-anchor="middle" fill="${escapeXml(
    params.filled,
  )}" opacity="0.68" font-family="Inter, Arial, sans-serif" font-size="${progressSize}" font-weight="500">${escapeXml(
    progress,
  )}</text>
</svg>`;
}
