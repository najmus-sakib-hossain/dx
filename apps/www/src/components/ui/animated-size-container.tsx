import { motion } from "framer-motion";
import {
  type ComponentPropsWithoutRef,
  type PropsWithChildren,
  forwardRef,
} from "react";
import { useResizeObserver } from "@/hooks/use-resize-observer";
import { cn } from "@/lib/utils";

type AnimatedSizeContainerProps = PropsWithChildren<{
  width?: boolean;
  height?: boolean;
}> &
  Omit<ComponentPropsWithoutRef<typeof motion.div>, "animate" | "children">;

/**
 * A container with animated width and height (each optional) based on children dimensions
 */
const AnimatedSizeContainer = forwardRef<
  HTMLDivElement,
  AnimatedSizeContainerProps
>(
  (
    {
      width = false,
      height = false,
      className,
      transition,
      children,
      ...rest
    }: AnimatedSizeContainerProps,
    forwardedRef,
  ) => {
    const { ref, width: observedWidth, height: observedHeight } = useResizeObserver<HTMLDivElement>();

    return (
      <motion.div
        ref={forwardedRef}
        className={cn("overflow-hidden", className)}
        animate={{
          width: width && observedWidth ? observedWidth : "auto",
          height: height && observedHeight ? observedHeight : "auto",
        }}
        transition={transition ?? { type: "spring", duration: 0.3 }}
        {...rest}
      >
        <div
          ref={ref}
          className={cn(height && "h-max", width && "w-max")}
        >
          {children}
        </div>
      </motion.div>
    );
  },
);

AnimatedSizeContainer.displayName = "AnimatedSizeContainer";

export { AnimatedSizeContainer };
