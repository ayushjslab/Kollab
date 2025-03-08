import { Button } from "@/components/ui/button";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Info, Search } from "lucide-react";
import React, { useState } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useRouter } from "next/navigation";
import { DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { CgMonday } from "react-icons/cg";
import { marckScript } from "@/components/fonts";

export const Toolbar = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });
  const [open, setOpen] = useState(false);
  const { data: channels } = useGetChannels({ workspaceId });
  const { data: members } = useGetMembers({ workspaceId });

  console.log(channels, members, "dvjri");

  const onChannelClick = (channelId: string) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/channel/${channelId}`);
  };

  const onMemberClick = (memberId: string) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/member/${memberId}`);
  };

  return (
    <nav className="bg-gradient-to-r from-[#1f2522] to-[#3e4443] flex items-center justify-between h-12 px-4 shadow-md md:px-6 lg:h-14">
      <div className="flex items-center gap-3">
        <CgMonday color="#EAEAEA" className="text-5xl" />
        <h1
          className={`font-bold text-4xl bg-gradient-to-r from-[#1c7c73] to-[#3f928f] bg-clip-text text-transparent drop-shadow-md`}
        >
          Kollab
        </h1>
      </div>
      {/* Left Spacer */}
      <div className="hidden md:flex flex-1" />

      {/* Search Bar */}
      <div
        className="flex-grow max-w-full sm:max-w-[200px] md:max-w-[400px] lg:max-w-[600px]"
        onClick={() => setOpen(true)}
      >
        <Button
          size="sm"
          className="bg-white/20 hover:bg-white/30 w-full justify-start h-9 px-3 rounded-lg transition-all"
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-sm opacity-80 hidden sm:inline">
            Search workspace...
          </span>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <DialogTitle asChild>
            <VisuallyHidden>Search and navigate workspace</VisuallyHidden>
          </DialogTitle>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                <CommandItem
                  key={channel._id}
                  onSelect={() => onChannelClick(channel._id)}
                >
                  {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Members">
              {members?.map((member) => (
                <CommandItem
                  key={member._id}
                  onSelect={() => onMemberClick(member._id)}
                >
                  {member.user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>

      {/* Right Section */}
      <div className="ml-auto flex flex-1 items-center justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-white/10 transition-all p-2 rounded-lg"
        >
          <Info className="h-8 w-8 text-white opacity-80" />
        </Button>
      </div>
    </nav>
  );
};
