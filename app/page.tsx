"use client";

import { useEffect, useMemo, useState } from "react";

type ThemeName = "midnight" | "paper" | "neon" | "custom";
type Density = "compact" | "balanced" | "bold";
type MarkerStyle = "dot" | "ring" | "glow";
type LabelMode = "hidden" | "percent" | "remaining" | "elapsed";

const canvas = {
  width: 1179,
  height: 2556,
};

function buildWallpaperConfig(options: {
  theme: ThemeName;
  customTheme: {
    background: string;
    filled: string;
    empty: string;
    current: string;
    label: string;
  };
  density: Density;
  markerStyle: MarkerStyle;
  label: LabelMode;
  showGoal: boolean;
  showYear: boolean;
  diagonal: boolean;
}) {
  return {
    canvas,
    theme: options.theme,
    customTheme: options.customTheme,
    birthDate: "1990-01-01",
    lifeYears: 90,
    markerStyle: options.markerStyle,
    grids: [
      {
        type: "life",
        enabled: true,
        frame: {
          x: 80,
          y: options.diagonal ? 760 : 700,
          width: 1019,
          height: options.showGoal || options.showYear ? 920 : 1120,
        },
        rotation: options.diagonal ? -8 : 0,
        density: options.density,
        label: options.label,
      },
      {
        type: "goal",
        enabled: options.showGoal,
        targetDate: "2026-12-31",
        frame: {
          x: options.diagonal ? 118 : 150,
          y: options.diagonal ? 1715 : 1740,
          width: 879,
          height: 260,
        },
        rotation: options.diagonal ? 9 : 0,
        density: options.density === "compact" ? "balanced" : "bold",
        label: "remaining",
      },
      {
        type: "year",
        enabled: options.showYear,
        frame: {
          x: options.diagonal ? 165 : 150,
          y: options.diagonal ? 2075 : 2070,
          width: 879,
          height: 190,
        },
        rotation: options.diagonal ? -6 : 0,
        density: "compact",
        label: "percent",
      },
    ],
  };
}

const legacyPreviewPath =
  "/api/wallpaper?birth=1990-01-01&life=90&filled=%23f5f5f5&empty=%233f3f46&bg=%23050505&cell=8&gap=2&layout=single&width=1179&height=2556";

export default function Home() {
  const [theme, setTheme] = useState<ThemeName>("midnight");
  const [customTheme, setCustomTheme] = useState({
    background: "#050505",
    filled: "#f5f5f5",
    empty: "#3f3f46",
    current: "#f97316",
    label: "#f5f5f5",
  });
  const [density, setDensity] = useState<Density>("balanced");
  const [markerStyle, setMarkerStyle] = useState<MarkerStyle>("glow");
  const [label, setLabel] = useState<LabelMode>("percent");
  const [showGoal, setShowGoal] = useState(true);
  const [showYear, setShowYear] = useState(true);
  const [diagonal, setDiagonal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(legacyPreviewPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");

  const wallpaperConfig = useMemo(
    () =>
      buildWallpaperConfig({
        theme,
        customTheme,
        density,
        markerStyle,
        label,
        showGoal,
        showYear,
        diagonal,
      }),
    [customTheme, density, diagonal, label, markerStyle, showGoal, showYear, theme],
  );

  function updateCustomColor(key: keyof typeof customTheme, value: string) {
    setCustomTheme((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function downloadWallpaper() {
    setIsDownloading(true);
    setError("");

    try {
      const response = await fetch("/api/wallpaper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wallpaperConfig),
      });

      if (!response.ok) {
        throw new Error("PNG could not be generated.");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `life-calendar-${theme}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Something went wrong.");
    } finally {
      setIsDownloading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    let objectUrl = "";

    async function generatePreview() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("/api/wallpaper", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(wallpaperConfig),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Preview could not be generated.");
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setPreviewUrl((previousUrl) => {
          if (previousUrl.startsWith("blob:")) {
            URL.revokeObjectURL(previousUrl);
          }

          return objectUrl;
        });
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setError(requestError instanceof Error ? requestError.message : "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    generatePreview();

    return () => {
      controller.abort();
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [wallpaperConfig]);

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Life Calendar Wallpaper</p>
          <h1>Your weeks, quietly on your wallpaper.</h1>
          <p className="lede">
            A minimal mobile app that turns your lifetime into a clean calendar wallpaper, generated
            fresh from your preferences without accounts, storage, or noise.
          </p>
          <div className="store-links" aria-label="Download links">
            <a href="https://www.apple.com/app-store/" rel="noreferrer" target="_blank">
              App Store
            </a>
            <a href="https://play.google.com/store" rel="noreferrer" target="_blank">
              Google Play
            </a>
          </div>
        </div>
        <div className="preview-frame" aria-label="Life calendar wallpaper preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Life calendar wallpaper preview" />
        </div>
      </section>

      <section className="demo-section" aria-label="Wallpaper preview controls">
        <div className="demo-copy">
          <p className="eyebrow">Dev Preview</p>
          <h2>Try the modular wallpaper renderer.</h2>
          <p>
            This temporary playground calls the internal PNG API and shows the result without
            exposing generated URLs.
          </p>
          {isLoading ? <p className="status-text">Generating preview...</p> : null}
          {isDownloading ? <p className="status-text">Preparing PNG...</p> : null}
          {error ? <p className="error-text">{error}</p> : null}
        </div>

        <div className="demo-controls">
          <label>
            <span>Theme</span>
            <select value={theme} onChange={(event) => setTheme(event.target.value as ThemeName)}>
              <option value="midnight">Midnight</option>
              <option value="paper">Paper</option>
              <option value="neon">Neon</option>
              <option value="custom">Custom</option>
            </select>
          </label>

          <label>
            <span>Dot density</span>
            <select
              value={density}
              onChange={(event) => setDensity(event.target.value as Density)}
            >
              <option value="compact">Compact</option>
              <option value="balanced">Balanced</option>
              <option value="bold">Bold</option>
            </select>
          </label>

          <label>
            <span>Current marker</span>
            <select
              value={markerStyle}
              onChange={(event) => setMarkerStyle(event.target.value as MarkerStyle)}
            >
              <option value="dot">Dot</option>
              <option value="ring">Ring</option>
              <option value="glow">Glow</option>
            </select>
          </label>

          <label>
            <span>Life label</span>
            <select value={label} onChange={(event) => setLabel(event.target.value as LabelMode)}>
              <option value="hidden">Hidden</option>
              <option value="percent">Percent</option>
              <option value="remaining">Remaining</option>
              <option value="elapsed">Elapsed</option>
            </select>
          </label>

          <label className="toggle-row">
            <input
              checked={showGoal}
              type="checkbox"
              onChange={(event) => setShowGoal(event.target.checked)}
            />
            <span>Show goal grid</span>
          </label>

          <label className="toggle-row">
            <input
              checked={showYear}
              type="checkbox"
              onChange={(event) => setShowYear(event.target.checked)}
            />
            <span>Show year grid</span>
          </label>

          <label className="toggle-row">
            <input
              checked={diagonal}
              type="checkbox"
              onChange={(event) => setDiagonal(event.target.checked)}
            />
            <span>Diagonal layout</span>
          </label>

          {theme === "custom" ? (
            <div className="custom-colors">
              <label>
                <span>Background</span>
                <input
                  type="color"
                  value={customTheme.background}
                  onChange={(event) => updateCustomColor("background", event.target.value)}
                />
              </label>
              <label>
                <span>Elapsed</span>
                <input
                  type="color"
                  value={customTheme.filled}
                  onChange={(event) => updateCustomColor("filled", event.target.value)}
                />
              </label>
              <label>
                <span>Future</span>
                <input
                  type="color"
                  value={customTheme.empty}
                  onChange={(event) => updateCustomColor("empty", event.target.value)}
                />
              </label>
              <label>
                <span>Current</span>
                <input
                  type="color"
                  value={customTheme.current}
                  onChange={(event) => updateCustomColor("current", event.target.value)}
                />
              </label>
              <label>
                <span>Label</span>
                <input
                  type="color"
                  value={customTheme.label}
                  onChange={(event) => updateCustomColor("label", event.target.value)}
                />
              </label>
            </div>
          ) : null}

          <button className="download-button" disabled={isDownloading} onClick={downloadWallpaper}>
            {isDownloading ? "Generating..." : "Generate PNG"}
          </button>
        </div>
      </section>

      <section className="shortcut-section" aria-label="Shortcut setup video">
        <div className="video-panel">
          <div className="play-mark" aria-hidden="true" />
          <p>Shortcut setup video</p>
        </div>
        <div className="shortcut-copy">
          <p className="eyebrow">Setup</p>
          <h2>Install the shortcut, choose your wallpaper style, and let the app refresh it.</h2>
          <p>
            The app calls the wallpaper API internally and uses the generated PNG directly. Visitors
            to this site only see the product page, download links, and setup video.
          </p>
        </div>
      </section>
    </main>
  );
}
