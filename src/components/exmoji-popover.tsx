// import data from "@emoji-mart/data";
// import Picker from "@emoji-mart/react";
import EmojiPicker, {type EmojiClickData } from "emoji-picker-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface EmojiPopoverProps {
  children: React.ReactNode;
  hint?: string;
  onEmojiSelect: (value: string) => void;
}

export const EmojiPopover = ({
  children,
  hint = "Emoji",
  onEmojiSelect,
}: EmojiPopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const onSelect = (value: EmojiClickData) => {
    onEmojiSelect(value.emoji);
    setPopoverOpen(false);

    setTimeout(() => {
      setTooltipOpen(false);
    }, 500);
  };
  return (
    <TooltipProvider>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Tooltip
          open={tooltipOpen}
          onOpenChange={setTooltipOpen}
          delayDuration={50}
        >
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="bg-teal-500 text-white border border-white/10 px-3 py-2 rounded-lg shadow-lg text-xs font-semibold tracking-wide transition-all duration-200">
            {hint}
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="p-0 w-full border-none shadow-none">
          {/* <Picker data={data} onEmojiSelect={onSelect} /> */}
          <EmojiPicker onEmojiClick={onSelect}/>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};
