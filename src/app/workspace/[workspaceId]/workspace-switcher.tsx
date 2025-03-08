import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Playwrite_GB_S } from "next/font/google";

const playwrite: { className: string } = Playwrite_GB_S({
  weight: "400",
});

export const WorkspaceSwitcher = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_open, setOpen] = useCreateWorkspaceModal();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();

  // I am not want to render curently workspace
  const filteredWorkspaces = workspaces?.filter(
    (workspace) => workspace?._id !== workspaceId
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="px-4 py-2 rounded-lg bg-teal-500 text-white font-bold transition duration-200 hover:bg-white hover:text-black border-2 border-transparent hover:border-teal-500"
        >
          {workspaceLoading ? (
            <Loader className="size-5 animate-spin shrink-0 text-white" />
          ) : (
            workspace?.name.charAt(0).toUpperCase()
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="start"
        className="w-72 bg-white/20 backdrop-blur shadow-lg rounded-xl p-2"
      >
        {/* Active Workspace */}
        <DropdownMenuItem
          onClick={() => router.push(`/workspace/${workspaceId}`)}
          className="cursor-pointer flex flex-col gap-1 px-3 py-2 hover:bg-[#f3e5f5] rounded-xl transition"
        >
          <span className={`${playwrite.className} text-xl font-medium text-[#481349]`}>{workspace?.name}</span>
          <span className="text-xs text-gray-500">Active workspace</span>
        </DropdownMenuItem>

        {/* Other Workspaces */}
        {filteredWorkspaces?.map((workspace) => (
          <DropdownMenuItem
            key={workspace._id}
            className="cursor-pointer flex items-center gap-3 px-3 py-2 hover:bg-[#f3e5f5] rounded-lg transition"
            onClick={() => router.push(`/workspace/${workspace._id}`)}
          >
            <div className="shrink-0 size-10 relative overflow-hidden bg-teal-500 text-white font-semibold text-xl rounded-md flex items-center justify-center">
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <p className={`${playwrite.className} truncate text-gray-900 font-medium`}>
              {workspace.name}
            </p>
          </DropdownMenuItem>
        ))}

        {/* Create New Workspace */}
        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-3 px-3 py-2 hover:bg-[#f3e5f5] rounded-lg transition"
          onClick={() => setOpen(true)}
        >
          <div className="size-10 bg-gray-200 text-[#481349] font-semibold text-xl rounded-md flex items-center justify-center ">
            <Plus />
          </div>
          <span className="font-medium text-[#481349]">
            Create a new workspace
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
