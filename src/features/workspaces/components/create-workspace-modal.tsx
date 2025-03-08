"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Playwrite_GB_S } from "next/font/google";
import { CgMonday } from "react-icons/cg";
import { marckScript } from "@/components/fonts";

const playwrite: { className: string } = Playwrite_GB_S({
  weight: "400",
});

export const CreateWorkspaceModal = () => {
  const router = useRouter();
  const [open, setOpen] = useCreateWorkspaceModal();
  const [name, setName] = useState("");

  const { mutate, isPending } = useCreateWorkspace();

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    mutate(
      { name },
      {
        onSuccess(id) {
          toast.success("Workspace created");
          router.push(`/workspace/${id}`);
          handleClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="p-6 rounded-2xl shadow-2xl bg-white/30 dark:bg-gray-900/50 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-3">
          <CgMonday color="#38cabc" className="text-5xl" />
          <h1
            className={`${marckScript.className} text-4xl bg-gradient-to-r from-[#32c9ba] to-[#7cfffb] bg-clip-text text-transparent drop-shadow-md`}
          >
            Kollab...
          </h1>
        </div>
        <DialogHeader className="text-center">
          <DialogTitle
            className={`${playwrite.className} text-2xl font-semibold text-white dark:text-white`}
          >
            Create a New Workspace
          </DialogTitle>
          <p className="text-sm text-gray-300 dark:text-gray-200">
            Organize your projects efficiently with a dedicated workspace.
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            required
            autoFocus
            minLength={3}
            placeholder="e.g. 'Design Team', 'Marketing'"
            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isPending || name.trim().length < 3}
              className="px-6 py-2.5 rounded-lg bg-[#32c9ba] hover:bg-[#28a598] text-white font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="animate-spin size-4" /> : null}
              {isPending ? "Creating..." : "Create Workspace"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};