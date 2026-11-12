"use client";
import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/*
 * Adapted from the hover-footer component. Behaviour is unchanged: an outlined word that draws
 * itself in, with a colour gradient revealed under the cursor. Changes for this site:
 * - colours and font are props (the defaults are the original values), so the site can pass its own;
 * - gradient and mask ids are unique per instance;
 * - the outline draws in when it scrolls into view rather than on mount, and skips the animation
 *   for visitors who ask for reduced motion;
 * - the SVG is hidden from assistive tech, since it repeats text that is already on the page.
 */

const DEFAULT_STOPS = ["#eab308", "#ef4444", "#80eeb4", "#06b6d4", "#8b5cf6"];

export const TextHoverEffect = ({
  text,
  duration,
  className,
  fontClassName = "font-[helvetica] text-7xl font-bold",
  outlineClassName = "stroke-neutral-200 dark:stroke-neutral-800",
  drawClassName = "stroke-[#3ca2fa] dark:stroke-[#3ca2fa99]",
  gradientStops = DEFAULT_STOPS,
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
  className?: string;
  /** Font family, size and weight of the word, in SVG user units (the viewBox is 300 × 100). */
  fontClassName?: string;
  /** Stroke of the faint outline shown while hovered. */
  outlineClassName?: string;
  /** Stroke of the outline that draws itself in. */
  drawClassName?: string;
  /** Colours of the gradient revealed under the cursor, left to right. */
  gradientStops?: string[];
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });
  const reduceMotion = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const ids = { gradient: `textGradient-${uid}`, reveal: `revealMask-${uid}`, mask: `textMask-${uid}` };

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      // Hidden (display: none) on small screens: no box to measure, and dividing by 0 gives NaN%.
      if (!svgRect.width || !svgRect.height) return;
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={cn("select-none uppercase cursor-pointer", className)}
    >
      <defs>
        <linearGradient id={ids.gradient} gradientUnits="userSpaceOnUse" cx="50%" cy="50%" r="25%">
          {hovered &&
            gradientStops.map((color, i) => (
              <stop key={i} offset={`${(i / Math.max(1, gradientStops.length - 1)) * 100}%`} stopColor={color} />
            ))}
        </linearGradient>

        <motion.radialGradient
          id={ids.reveal}
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id={ids.mask}>
          <rect x="0" y="0" width="100%" height="100%" fill={`url(#${ids.reveal})`} />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className={cn("fill-transparent", fontClassName, outlineClassName)}
        style={{ opacity: hovered ? 0.7 : 0 }}
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className={cn("fill-transparent", fontClassName, drawClassName)}
        initial={{ strokeDashoffset: reduceMotion ? 0 : 1000, strokeDasharray: 1000 }}
        whileInView={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{
          duration: reduceMotion ? 0 : 4,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke={`url(#${ids.gradient})`}
        strokeWidth="0.3"
        mask={`url(#${ids.mask})`}
        className={cn("fill-transparent", fontClassName)}
      >
        {text}
      </text>
    </svg>
  );
};

export const FooterBackgroundGradient = ({
  background = "radial-gradient(125% 125% at 50% 10%, #0F0F1166 50%, #3ca2fa33 100%)",
}: {
  /** CSS background; the default is the original blue glow. */
  background?: string;
}) => {
  return <div className="absolute inset-0 z-0" style={{ background }} />;
};
