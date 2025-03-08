import { useParams } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";

export const useWorkspaceId = () => {
  const param = useParams();

  return param.workspaceId as Id<"workspaces">;
};
