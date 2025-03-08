import { useParams } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";

export const useChannelId = () => {
  const param = useParams();

  return param.channelId as Id<"channels">;
};
