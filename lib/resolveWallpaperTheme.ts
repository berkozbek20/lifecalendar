import { ModularWallpaperConfig, WallpaperTheme, wallpaperThemes } from "./wallpaperConfig";

export function resolveWallpaperTheme(config: ModularWallpaperConfig): WallpaperTheme {
  if (config.theme === "custom") {
    return config.customTheme;
  }

  return wallpaperThemes[config.theme];
}
