import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

interface SidebarButtonProps {
  icon: LucideIcon | IconType;
  fillIcon: IconType;
  label: string;
  isActive?: boolean;
}

export const SidebarButton = ({
  icon: Icon,
  fillIcon: FillIcon,
  label,
  isActive,
}: SidebarButtonProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-1 cursor-pointer group">
      {isActive ? (
        <Button
          variant={"transparent"}
          className={cn(
            "size-11 p-3 rounded-xl bg-[#E3D2C3] shadow-lg shadow-[#0e9285]/40 transition-all duration-300 ease-in-out group-hover:bg-[#ffe7d1] group-hover:scale-125 text-[#2C2C2C]",
            "bg-[#f7e8da] scale-110 ring-1 ring-[#ffb3ff] shadow-[#E3D2C3]/50"
          )}
        >
          <FillIcon
            color="#38CABC"
            className={cn(
              "scale-150 text-white transition-transform duration-200 group-hover:scale-125 group-hover:text-[#2C2C2C] hover:text-[#2C2C2C] "
            )}
          />
        </Button>
      ) : (
        <Button
          variant={"transparent"}
          className={cn(
            "p-3 rounded-xl bg-teal-600 shadow-lg shadow-[#0e9285]/40 transition-all duration-300 scale-110 ease-in-out group-hover:bg-[#ffe7d1] group-hover:scale-125 text-[#2C2C2C]"
          )}
        >
          <Icon
            className={cn(
              "scale-125 text-white transition-transform duration-200 group-hover:scale-125 group-hover:text-[#2C2C2C]",
              isActive && "text-[#2C2C2C] scale-125"
            )}
          />
        </Button>
      )}
      <span
        className={cn(
          "text-[12px] text-white font-medium tracking-wide transition-all duration-300 group-hover:text-[#edffff] group-hover:translate-y-1",
          isActive && "text-[#118385] translate-y-1"
        )}
      >
        {label}
      </span>
    </div>
  );
};
