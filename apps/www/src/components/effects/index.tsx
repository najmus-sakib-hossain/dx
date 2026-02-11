import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

interface SpotlightProps {
    className?: string;
    fill?: string;
}

/**
 * Spotlight — animated SVG spotlight effect for hero sections.
 * Creates a soft elliptical glow that animates in from off-screen.
 * Adapted from tweakcn effects.
 *
 * @param className - Additional CSS classes for positioning.
 * @param fill - Fill color for the spotlight (defaults to white).
 */
export const Spotlight = ({ className, fill }: SpotlightProps): React.ReactElement => {
    return (
        <svg
            className={cn(
                "animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%]",
                className
            )}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 3787 2842"
            fill="none"
        >
            <g filter="url(#dx-spotlight-filter)">
                <ellipse
                    cx="1924.71"
                    cy="273.501"
                    rx="1924.71"
                    ry="273.501"
                    transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
                    fill={fill || "white"}
                    fillOpacity="0.21"
                />
            </g>
            <defs>
                <filter
                    id="dx-spotlight-filter"
                    x="0.860352"
                    y="0.838989"
                    width="3785.16"
                    height="2840.26"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feGaussianBlur
                        stdDeviation="151"
                        result="effect1_foregroundBlur"
                    />
                </filter>
            </defs>
        </svg>
    );
};

/**
 * NoiseEffect — SVG fractal noise texture overlay.
 * Adds a subtle film-grain feel to sections. Purely decorative.
 * Adapted from tweakcn effects.
 */
export const NoiseEffect = (): React.ReactElement => {
    return (
        <svg
            className="pointer-events-none absolute inset-0 z-10 opacity-[8%]"
            width="100%"
            height="100%"
            aria-hidden="true"
        >
            <filter id="dx-noise">
                <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.70"
                    numOctaves="4"
                    stitchTiles="stitch"
                />
            </filter>
            <rect width="100%" height="100%" filter="url(#dx-noise)" />
        </svg>
    );
};

interface FrameHighlightProps extends ComponentProps<"span"> {
    children: React.ReactNode;
    className?: string;
}

/**
 * FrameHighlight — decorative bracket-frame highlight around inline text.
 * Adds corner crosses and a dashed border in the primary color.
 * Adapted from tweakcn effects.
 *
 * @param children - The text content to highlight.
 * @param className - Additional CSS classes.
 */
export const FrameHighlight = ({
    children,
    className,
    ...props
}: FrameHighlightProps): React.ReactElement => {
    return (
        <>
            {" "}
            <span className="relative h-fit px-1 text-nowrap">
                <span className={cn("w-full", className)} {...props}>
                    {children}
                </span>
                <span className="border-primary/60 bg-primary/15 absolute inset-0 h-full border border-dashed px-1.5">
                    <Corner className="fill-primary absolute top-[-2px] left-[-2px]" />
                    <Corner className="fill-primary absolute top-[-2px] right-[-2px]" />
                    <Corner className="fill-primary absolute bottom-[-2px] left-[-2px]" />
                    <Corner className="fill-primary absolute right-[-2px] bottom-[-2px]" />
                </span>
            </span>{" "}
        </>
    );
};

const Corner = ({
    className,
}: ComponentProps<"svg">): React.ReactElement => {
    return (
        <svg
            width="5"
            height="5"
            viewBox="0 0 5 5"
            className={cn("absolute", className)}
            aria-hidden="true"
        >
            <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
        </svg>
    );
};
