"use client";

import { CreateChannelModal } from "@/features/channels/components/create-channel-modal";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";
import { useEffect, useState } from "react";

export const Modals = () => {
    const [mounted, setMounted] = useState(false);

    // for prevent the hydration error
    // it is not happen in server side
    useEffect(() => {
        setMounted(true);
    },[])
    if(!mounted) {
        return null;
    }
    return (
        <>
            <CreateChannelModal/>
            <CreateWorkspaceModal/>
        </>
    )
}