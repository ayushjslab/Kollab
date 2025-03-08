import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

export const InviteModal = ({
  open,
  setOpen,
  name,
  joinCode,
}: InviteModalProps) => {
  const workspaceId = useWorkspaceId();

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;

    navigator.clipboard.writeText(inviteLink).then(() => {
      toast.success("Invite link copied to clipboard");
    });
  };

  const {mutate, isPending} = useNewJoinCode();

  const handleNewCode = async () => {
    const ok = await confirm();

    if(!ok) return;
    mutate({workspaceId}, {
        onSuccess: () => {
            toast.success("Invite code regenerated");
        },
        onError: () => {
            toast.error("Failed to regenerate invite code");
        }
    })
  }

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This will deactivate the current invite code and generate a new one"
  )

  return (
    <>
    <ConfirmDialog/>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-2xl bg-white/90 backdrop-blur-md shadow-xl border border-gray-200 p-6">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-semibold text-gray-900">
              Invite People to <span className="text-primary">{name}</span>
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Share the code below or copy the invite link to invite others.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center gap-y-6 py-8">
            <p className="text-5xl font-bold tracking-widest uppercase text-gray-800 bg-gray-100 px-6 py-3 rounded-lg shadow-inner">
              {joinCode}
            </p>
            <Button
              variant="outline"
              onClick={handleCopy}
              className="flex items-center gap-x-2 px-4 py-2 border-gray-300 shadow-sm hover:bg-gray-100 transition"
            >
              <CopyIcon className="size-4" /> Copy Invite Link
            </Button>
          </div>
          <div className="flex items-center justify-between w-full">
            <Button
              onClick={handleNewCode}
              variant={"outline"}
              disabled={isPending}
            >
              New code
              <RefreshCcw className="size-4 ml-2" />
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
