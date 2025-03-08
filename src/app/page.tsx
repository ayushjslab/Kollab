"use client"

import { UserButton } from "@/features/auth/components/user-button";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Smile } from "lucide-react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { CgMonday } from "react-icons/cg";

export default function Home() {
  const [open, setOpen] = useCreateWorkspaceModal();

  const {data, isLoading} = useGetWorkspaces();

  const router = useRouter();

  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if(isLoading) return;
    if(workspaceId) {
      router.replace(`/workspace/${workspaceId}`)
    }else if(!open){
      setOpen(true);
    }
  },[workspaceId, isLoading, open, setOpen, router])
  return (
    <BackgroundLines className="h-full flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-[#1f2522] to-[#363b3a]">
      {/* Welcome Message */}
      <CgMonday color="#EAEAEA" className="text-[100px]" />
      <h1 className="text-[60px] font-bold text-gray-200">
        Step into <span className="text-teal-500">Kollab</span>
      </h1>

      {/* Subtitle */}
      <p className="text-gray-200 mt-2 text-lg">
        A space designed for efficiency, creativity, and seamless collaboration
      </p>

      {/* User Avatar Button */}
      <div className="mt-6">
        <UserButton />
      </div>

      {/* Icon */}
      <div className="mt-6 text-[#32c9ba]">
        <Smile className="size-12" />
      </div>
    </BackgroundLines>
  );
}
