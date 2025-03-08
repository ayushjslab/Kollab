"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface HintProps {
  label: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export const Hint = ({
  label,
  children,
  side = "top",
  align = "center",
}: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className="bg-teal-600  text-white border border-teal-900/10 px-3 py-2 rounded-lg shadow-lg transition-all duration-200 animate-fade-in"
        >
          <p className="font-semibold text-xs tracking-wide">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
