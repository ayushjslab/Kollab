import { UserButton } from "@/features/auth/components/user-button";
import React from "react";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { SidebarButton } from "./SidebarButton";
import { MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";
import { FaHome } from "react-icons/fa";
import { MdChat } from "react-icons/md";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineChat } from "react-icons/md";
import { FaRegBell } from "react-icons/fa";
import { FaBell } from "react-icons/fa";

export const Sidebar = () => {

    const pathname= usePathname();

  return (
    <aside className="w-[70px] h-full bg-gradient-to-b from-[#1f2522] to-[#3e4443] flex flex-col gap-y-4 items-center pt-[9px] pb-4">
      <WorkspaceSwitcher />
      <div className="flex flex-col gap-y-8 pt-4">
        <SidebarButton
          fillIcon={FaHome}
          icon={IoHomeOutline}
          label="Home"
          isActive={pathname.includes("/workspace")}
        />
        <SidebarButton
          fillIcon={MdChat}
          icon={MdOutlineChat}
          label="DMs"
          isActive={pathname.includes("/dms")}
        />
        <SidebarButton
          fillIcon={FaBell}
          icon={FaRegBell}
          label="Activity"
          isActive={pathname.includes("/activity")}
        />
        <SidebarButton
          fillIcon={MoreHorizontal}
          icon={MoreHorizontal}
          label="More"
          isActive={pathname.includes("/more")}
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  );
};
