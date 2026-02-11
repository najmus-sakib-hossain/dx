export const APP_NAME = "DX" as const;
export const APP_DESCRIPTION = "Enhanced Development Experience" as const;
export const APP_URL = "https://dx.dev" as const;

export const MAX_CHAT_MESSAGES = 200 as const;
export const CHAT_MESSAGE_MAX_LENGTH = 500 as const;
export const CHAT_RATE_LIMIT_MS = 1000 as const;

export const DOCK_ANIMATION = {
  MAGNIFICATION_RANGE: 150,
  BASE_SIZE: 40,
  MAX_SIZE: 80,
  SPRING_CONFIG: {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  },
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  "3xl": 1600,
  "4xl": 2000,
} as const;

export const ANIMATION_DURATION = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  page: 0.6,
} as const;

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#0a0a0a",
} as const;
