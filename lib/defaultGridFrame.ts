import type { GridFrame, GridType } from "./wallpaperConfig";

type CanvasSize = {
  width: number;
  height: number;
};

function gridWeight(type: GridType) {
  if (type === "life") {
    return 1.55;
  }

  return 1;
}

export function defaultGridFrameForLayout(
  type: GridType,
  index: number,
  gridTypes: GridType[],
  canvas: CanvasSize,
): GridFrame {
  const marginX = Math.round(canvas.width * 0.07);
  const top = Math.round(canvas.height * 0.32);
  const bottom = Math.round(canvas.height * 0.07);
  const gap = Math.round(canvas.height * 0.035);
  const availableHeight = canvas.height - top - bottom - Math.max(0, gridTypes.length - 1) * gap;
  const weights = gridTypes.map(gridWeight);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const previousWeight = weights.slice(0, index).reduce((sum, weight) => sum + weight, 0);
  const frameHeight = Math.round((availableHeight * gridWeight(type)) / totalWeight);
  const y = top + Math.round((availableHeight * previousWeight) / totalWeight) + index * gap;

  return {
    x: marginX,
    y,
    width: canvas.width - marginX * 2,
    height: frameHeight,
  };
}
