"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "../api/use-current-user";
import { Loader, LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

export const UserButton = () => {
  const { signOut } = useAuthActions();
  const { data, isLoading } = useCurrentUser();

  if (isLoading) {
    return <Loader className="size-4 animate-spin text-muted-foreground" />;
  }

  if (!data) {
    return null;
  }

  const { image, name, email } = data;
  const avatarFallback = name!.charAt(0).toUpperCase();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 rounded-md shadow-md transition-all hover:scale-105 hover:opacity-90">
          <AvatarImage alt={name} src={image} className="rounded-md" />
          <AvatarFallback className="bg-[#32c9ba] text-white font-semibold rounded-md">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side="right"
        className="w-64 p-3 bg-white shadow-xl rounded-xl border border-gray-200"
      >
        {/* User Info Section */}
        <div className="flex flex-col items-center text-center px-4 py-4">
          <Avatar className="size-16 mb-3 shadow-md border border-gray-300">
            <AvatarImage alt={name} src={image} />
            <AvatarFallback className="bg-[#32c9ba] text-white font-semibold">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="font-semibold text-gray-900 text-lg">{name}</div>
          <div className="text-sm text-gray-600">{email}</div>
        </div>

        <DropdownMenuSeparator className="my-2 border-gray-200" />

        {/* Logout Button */}
        <DropdownMenuItem
          onClick={() => signOut()}
          className="h-12 flex items-center justify-center font-medium text-red-600 cursor-pointer transition-all rounded-lg hover:bg-red-100 hover:text-red-700 active:bg-red-200"
        >
          <LogOut className="size-5 mr-2 text-red-600" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
