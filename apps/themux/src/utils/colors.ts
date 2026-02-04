import Color from "color";
import { parse } from "culori";
import { colorFormatter } from "./color-converter";
import { getContrastRatio } from "./contrast-checker";

export function getOptimalForegroundColor(
  baseForegroundColor: string,
  baseBackgroundColor: string,
): string {
  const CONTRAST_RATIO_THRESHOLD = 4.5;
  const MAX_RECURSION_DEPTH = 4;

  function helper(fg: string, bg: string, depth: number): string {
    if (!isValidColor(fg)) {
      throw new Error(`Invalid foreground color format: ${fg}`);
    }
    if (!isValidColor(bg)) {
      throw new Error(`Invalid background color format: ${bg}`);
    }

    // Format the initial color once
    const bgColorInHsl = colorFormatter(bg, "hsl", "4");
    const fgColorInHsl = colorFormatter(fg, "hsl", "4");

    const contrastRatio = parseFloat(
      getContrastRatio(bgColorInHsl, fgColorInHsl),
    );

    if (contrastRatio >= CONTRAST_RATIO_THRESHOLD) return fgColorInHsl;
    if (depth >= MAX_RECURSION_DEPTH) return fgColorInHsl;

    const bgColor = Color(bgColorInHsl);
    const fgColor = Color(fgColorInHsl);
    const isBgColorDark = bgColor.isDark();

    // Get HSL values from the foreground color (not background)
    const hue = fgColor.hue();
    const saturation = fgColor.saturationl();
    const lightness = fgColor.lightness();

    // Contrast is insufficient, adjust foreground color lightness
    let newLightness: number;
    if (isBgColorDark) {
      // For dark backgrounds, make foreground lighter
      newLightness = Math.min(100, lightness + 15);
    } else {
      // For light backgrounds, make foreground darker
      newLightness = Math.max(0, lightness - 15);
    }

    // Create new color with adjusted lightness
    const adjustedFgColor = Color.hsl(hue, saturation, newLightness);
    return helper(adjustedFgColor.hsl().toString(), bgColorInHsl, depth + 1);
  }

  return helper(baseForegroundColor, baseBackgroundColor, 0);
}

export function isValidColor(color: string): boolean {
  try {
    const parsedColor = parse(color);
    if (!parsedColor) return false;
    return true;
  } catch {
    return false;
  }
}
