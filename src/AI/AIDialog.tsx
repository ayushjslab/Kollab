import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon, Sparkles } from "lucide-react";
import { Hint } from "@/components/hint";
import QuillEditor from "@/components/quill";
import { getResponse } from "./AIResponse";
import { CodePrompt } from "./prompt";
import { toast } from "sonner";

interface AIDialogProps {
  isOpen: boolean;
  onClose: () => void;
  value: string
  text: string
}


export function AIDialog({ isOpen, onClose, value}: AIDialogProps) {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string | null>();
  const [isOutputDialogOpen, setIsOutputDialogOpen] = useState<boolean>(false);

  const PROMPT = `${CodePrompt} os on the basis of your existance ${input} for this code ${value}`

  // Simulate AI response
  const handleAIQuery = async() => {
    const result = await getResponse(PROMPT) || "";
    const cleanedString = result.replace(/```json|```/g, "").trim();
    setOutput(cleanedString)
    setIsOutputDialogOpen(true);
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(output || "").then(
      () => {
        toast.success("Output copied");
      },
      (error) => {
        console.error("Failed to copy text: ", error);
      }
    );
  };

  console.log(output)
  console.log(value)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Analyse the code with AI</DialogTitle>
          <DialogDescription>
            Enter a query to get an AI response.
          </DialogDescription>
        </DialogHeader>

        {/* Input Section */}
        
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <QuillEditor value={value} tools={false} />
              <Label htmlFor="ai-query" className="text-right">
                Your Query
              </Label>
              <Input
                id="ai-query"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="col-span-3"
              />
              {/* Generate AI Response */}
              <Button onClick={handleAIQuery}>
                <Sparkles />
                Generate Response
              </Button>
            </div>
         
          {/* AI Output Section */}
          <Dialog
            open={isOutputDialogOpen}
            onOpenChange={() => setIsOutputDialogOpen(false)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription>AI Generated</DialogDescription>
              </DialogHeader>
              <div className="mt-1">
                <h3 className="text-lg font-semibold">AI Response:</h3>
                <div>
                  {output || ""}
                </div>
                {/* Copy Button with Tooltip */}
                <Hint label="Copy to clipboard" side="top">
                  <Button
                    variant="ghost"
                    className="absolute top-0 right-0 mt-2 mr-2"
                    onClick={handleCopy}
                  >
                    <CopyIcon />
                  </Button>
                </Hint>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AIDialog;
