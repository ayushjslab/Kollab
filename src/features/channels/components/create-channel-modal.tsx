import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCreateChannelModal } from "../store/use-create-channel-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCreateChannel } from "../api/use-create-channel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const CreateChannelModal = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateChannelModal();
  const [name, setName] = useState("");

  const { mutate, isPending } = useCreateChannel();

  const handleClose = () => {
    setName("");
    setOpen(false);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setName(value);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { name, workspaceId },
      {
        onSuccess: (id) => {
          handleClose();
          router.push(`/workspace/${workspaceId}/channel/${id}`);
          toast.success("Channel created successfully");
        },
        onError: () => {
          toast.error("Failed to create channel");
        },
      }
    );
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogTitle>Add a channel</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            disabled={isPending}
            onChange={handleChange}
            required
            value={name}
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder="e.g. mess-budget"
          />
          <div className="flex justify-end">
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
