import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace copy";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface PrefrencesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}

export const PrefrencesModal = ({
  open,
  setOpen,
  initialValue,
}: PrefrencesModalProps) => {
    const workspaceId = useWorkspaceId();
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure ?",
        "This action is irreversible."
    );
  const [value, setValue] = useState(initialValue);
  const [editOpen, setEditOpen] = useState(false);
  const router = useRouter();

  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkspace();
  const { mutate: removeWorkspace, isPending: isRemovingWorkspace } =
    useRemoveWorkspace();

    const handleRemove = async () => {
        const ok = await confirm();
        if(!ok) return;
        removeWorkspace(
          {
            id: workspaceId,
          },
          {
            onSuccess: () => {
                toast.success("Workspace removed");
                router.replace("/")
            },
            onError: () => {
              toast.error("Failed to remove workspace");
            },
          }
        );
    }

    const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        updateWorkspace({
            id: workspaceId,
            name: value,
        }, {
            onSuccess: () => {
                toast.success("Workspace updated")
                setEditOpen(false);
            },
            onError: () => {
                toast.error("Failed to update workspace")
            }
        })
    }
  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gradient-to-r from-[#1f2522] to-[#3e4443] text-white overflow-hidden">
          <DialogHeader className="p-4 border-b border-teal-700 bg-[#1f2522]">
            <DialogTitle>{value}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-teal-700 rounded-lg border border-teal-700 cursor-pointer hover:bg-teal-800 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">
                      Workspace name
                    </p>
                    <p className="text-sm text-white hover:underline font-semibold">
                      Edit
                    </p>
                  </div>
                  <p className="text-sm text-white">{value}</p>
                </div>
              </DialogTrigger>
              <DialogContent className="bg-[#1f2522] text-white">
                <DialogHeader>
                  <DialogTitle>Rename this workspace</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleEdit}>
                  <Input
                    value={value}
                    disabled={isUpdatingWorkspace}
                    onChange={(e) => setValue(e.target.value)}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="Workspace name e.g. 'Genix workspace', 'Mailza template workspace'"
                    className="bg-[#1f2522] text-white border border-teal-700 focus:ring-teal-700 focus:border-teal-700"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant={"outline"}
                        disabled={isUpdatingWorkspace}
                        className="text-teal-700 border-teal-700 hover:bg-teal-700 hover:text-white transition-colors"
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      disabled={isUpdatingWorkspace}
                      type="submit"
                      className="bg-teal-700 text-white hover:bg-teal-800 transition-colors"
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <button
              className="flex items-center gap-x-2 px-5 py-4 bg-teal-700 rounded-lg border border-teal-700 cursor-pointer hover:bg-teal-800 text-white"
              disabled={isRemovingWorkspace}
              onClick={handleRemove}
            >
              <TrashIcon className="size-4 text-white" />
              <p className="text-sm font-semibold">Delete workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
