import { useParams } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";

export const useMemberId = () => {
  const param = useParams();

  return param.memberId as Id<"members">;
};
