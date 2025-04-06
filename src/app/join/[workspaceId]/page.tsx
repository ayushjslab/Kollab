"use client";
import { Button } from "@/components/ui/button";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { useJoin } from "@/features/workspaces/api/use-join";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { CgMonday } from "react-icons/cg";
import VerificationInput from "react-verification-input"
import { toast } from "sonner";

interface JoinPagePops {
    params: {
        workspaceId: string;
    }
}

const JoinPage = ({params}: JoinPagePops) => {

  console.log(params)
    const router = useRouter();

    const {mutate, isPending} = useJoin();

    const workspaceId = useWorkspaceId();

    const {data, isLoading} = useGetWorkspaceInfo({id: workspaceId});

    const isMember = useMemo(() => data?.isMember, [data?.isMember]);

    useEffect(() => {
        if(isMember) {
            router.push(`/workspace/${workspaceId}`)
        }
    }, [isMember, router, workspaceId])

    const handleComplete = (value: string) => {
        mutate({workspaceId, joinCode: value}, {
            onSuccess: (id) => {
                router.replace(`/workspace/${id}`)
                toast.success("Workspace joined")
            },
            onError: () => {
                toast.error("Failed to join workspace")
            }
        })
    }

    if(isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="size-6 animate-spin to-muted-foreground"/>
            </div>
        )
    }

    return (
      <div className="h-full flex flex-col gap-y-2 items-center justify-center bg-gradient-to-br from-[#1f2522] to-[#363b3a] p-8 rounded-lg shadow-sm">
        <div className="flex items-center justify-center gap-4">
          <CgMonday className="text-white text-[100px]" />
          <h2 className="text-[80px] font-bold text-teal-600">Kollab</h2>
        </div>
        <div className="flex flex-col items-center justify-center max-w-md">
          <div className="flex flex-col gap-y-2 items-center justify-center">
            <h1 className="text-2xl font-bold text-gray-200">
              Join <span className="text-teal-600">{data?.name}</span>
            </h1>
            <p className="text-gray-200 text-md mb-2">
              Enter the workspace code to join
            </p>
          </div>
          <VerificationInput
            onComplete={handleComplete}
            length={6}
            classNames={{
              container: cn(
                "flex gap-x-2",
                isPending && "opacity-50 curssor-not-allowed"
              ),
              character:
                "uppercase h-12 w-12 rounded-lg border border-gray-300 flex items-center justify-center text-xl font-semibold text-gray-600 transition-all focus:ring-2 focus:ring-purple-500",
              characterInactive: "bg-gray-100",
              characterSelected: "bg-white text-black shadow-lg",
              characterFilled: "bg-white text-black shadow-md",
            }}
            autoFocus
          />
        </div>
        <Button className="text-white bg-teal-600 hover:bg-teal-700" onClick={() => router.push("/")}>
          Back to Home
        </Button>
      </div>
    );
}
 
export default JoinPage;