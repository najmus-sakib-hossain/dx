"use client";

import { ComponentErrorBoundary } from "@/components/error-boundary";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useThemeConfig } from "@/hooks/use-theme-config";
import { useColorFormat, useModesInSync } from "@/store/preferences-store";
import { ColorProperty, ThemeMode } from "@/types/theme";
import {
  colorFormatter,
  convertToHex,
  convertToOklch,
} from "@/utils/color-converter";
import { CircleAlert } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { PasteColorControl } from "./customizer-controls";
import { TokenDisplay, TokenInfo } from "./token";

type SingleColorSetter = (obj: {
  property: ColorProperty;
  color: string;
  modesInSync?: boolean;
}) => void;

type PairedColorSetter = (obj: {
  property: ColorProperty;
  bgColor: string;
  fgColor: string;
  modesInSync?: boolean;
}) => void;

interface TokenColorPickerProps {
  colorProperty: ColorProperty;
  color: string;
  syncModes?: boolean;
  setColorTokens: SingleColorSetter | PairedColorSetter;
}

export function TokenColorPicker({
  colorProperty,
  color,
  syncModes,
  setColorTokens,
}: TokenColorPickerProps) {
  const [currentColor, setCurrentColor] = useState(color);
  const hexColor = convertToHex(color);
  const modesInSync = useModesInSync();
  const { currentThemeObject } = useThemeConfig();
  const { resolvedTheme } = useTheme();

  const resolvedModesInSync = syncModes !== undefined ? syncModes : modesInSync;

  useEffect(() => {
    if (currentColor !== color) setCurrentColor(color);
  }, [color]);

  // Helper to get the corresponding foreground color for a background property
  const getForegroundProperty = (bgProperty: ColorProperty): ColorProperty => {
    if (bgProperty === "background") return "foreground";
    return `${bgProperty}-foreground` as ColorProperty;
  };

  // Helper to get the current foreground color for a background property
  const getCurrentForegroundColor = (bgProperty: ColorProperty): string => {
    const fgProperty = getForegroundProperty(bgProperty);
    const mode = resolvedTheme === "dark" ? "dark" : "light";
    return currentThemeObject[mode][fgProperty] || "#ffffff";
  };

  // Check if this is a paired color setter (expects bgColor and fgColor)
  const isPairedColorSetter = (): boolean => {
    const hasCorrespondingForeground =
      colorProperty === "background" ||
      colorProperty === "primary" ||
      colorProperty === "secondary" ||
      colorProperty === "card" ||
      colorProperty === "popover" ||
      colorProperty === "muted" ||
      colorProperty === "accent" ||
      colorProperty === "destructive" ||
      colorProperty === "sidebar" ||
      colorProperty === "sidebar-primary" ||
      colorProperty === "sidebar-accent";

    return hasCorrespondingForeground;
  };

  const handleColorChange = useCallback(
    (color: string) => {
      const newOklchColor = convertToOklch(color);
      setCurrentColor(newOklchColor);

      if (isPairedColorSetter()) {
        // This is a background color with corresponding foreground
        const currentFgColor = getCurrentForegroundColor(colorProperty);

        const pairedSetter = setColorTokens as PairedColorSetter;
        pairedSetter({
          property: colorProperty,
          bgColor: newOklchColor,
          fgColor: currentFgColor,
          modesInSync: resolvedModesInSync,
        });
      } else {
        // This is a single color (foreground, border, etc.)
        const singleSetter = setColorTokens as SingleColorSetter;
        singleSetter({
          property: colorProperty,
          color: newOklchColor,
          modesInSync: resolvedModesInSync,
        });
      }
    },
    [
      resolvedModesInSync,
      colorProperty,
      currentThemeObject,
      resolvedTheme,
      setColorTokens,
    ],
  );

  const debouncedHandleColorChange = useDebouncedCallback(
    handleColorChange,
    100,
  );

  // Create a wrapper for PasteColorControl that always expects single color format
  const handlePasteColorChange = useCallback(
    (obj: {
      property: ColorProperty;
      color: string;
      modesInSync?: boolean;
    }) => {
      handleColorChange(obj.color);
    },
    [handleColorChange],
  );

  return (
    <ComponentErrorBoundary
      name="TokenColorPicker"
      fallback={<ColorPickerErrorFallback />}
    >
      <Popover>
        <div className="flex items-center gap-2">
          <PopoverTrigger className="relative cursor-pointer">
            <TokenDisplay color={color} />
          </PopoverTrigger>
          <TokenInfo colorProperty={colorProperty} color={color} />
        </div>

        <PopoverContent className="flex h-fit w-60 gap-6 p-4" align="start">
          <div className="w-full space-y-2">
            <div className="mx-auto w-fit">
              <HexColorPicker
                color={hexColor}
                onChange={debouncedHandleColorChange}
              />
            </div>
            <div className="w-fit">
              <ColorOklchValue currentColor={currentColor} />
            </div>
            <PasteColorControl
              modesInSync={resolvedModesInSync}
              setColorTokens={handlePasteColorChange}
              property={colorProperty}
              className="w-50"
            />
          </div>
        </PopoverContent>
      </Popover>
    </ComponentErrorBoundary>
  );
}

function ColorOklchValue({ currentColor }: { currentColor: string }) {
  const colorFormat = useColorFormat();
  const colorValue = colorFormatter(currentColor, colorFormat, "4");

  return (
    <p className="text-muted-foreground font-mono text-xs">{colorValue}</p>
  );
}

// Error fallback to prevent *shittier* experiences, for the moment
function ColorPickerErrorFallback() {
  const { currentThemeObject } = useThemeConfig();
  const { resolvedTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <div className="relative cursor-pointer">
        <TokenDisplay
          color={currentThemeObject[resolvedTheme as ThemeMode].destructive!}
        />
        <CircleAlert className="absolute inset-0 m-auto size-4 text-neutral-50" />
      </div>

      <div>
        <p className="text-destructive font-mono text-xs font-semibold">
          Error occurred. I'm sorry :/
        </p>
        <p className="text-destructive/70 truncate font-mono text-xs">
          For now, refresh the page.
        </p>
      </div>
    </div>
  );
}
