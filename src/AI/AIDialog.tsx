import { useEffect, useState } from "react";
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
import { toast } from "sonner";
import MonacoEditor from "@monaco-editor/react"
import * as monaco from "monaco-editor";
import { CodePrompt } from "./prompt";
interface AIDialogProps {
  isOpen: boolean;
  onClose: () => void;
  value: string
  text: string
}

interface CodeOptimization {
  optimized_code: string;
  explanation: string;
  code_language: string;
  bugs: string;
  bug: string;
}

export function AIDialog({ isOpen, onClose, value, text}: AIDialogProps) {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<CodeOptimization[] | null>(null);
  const [isOutputDialogOpen, setIsOutputDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false)
  const PROMPT = `${input} for this ${text} ${CodePrompt}`

  // Simulate AI response
  const handleAIQuery = async() => {
    try {
      setLoading(true);
          const result = await getResponse(PROMPT);
          const cleanedString = result?.replace(/```json|```/g, "").trim();
          console.log(cleanedString)
          const parsedString =
            typeof cleanedString === "string"
              ? JSON.parse(cleanedString)
              : cleanedString;
          setOutput(Array.isArray(parsedString) ? parsedString : []);
          setIsOutputDialogOpen(true);
    } catch (error) {
      console.log(error)
    }
    finally{
      setLoading(false);
    }
  };

  let code = output?.[0]?.optimized_code || "";
  code = code.replace(/\\n/g, "\n").replace(/\\/g, "");

  const explanation = output?.[0]?.explanation || "";
  let language = output?.[0]?.code_language || "";
  language = language.toLowerCase();

  if(language === "c++"){
    language = "cpp"
  }

  if(language.includes("HTML")){
    language = "html"
  }

  const bugs = output?.[0]?.bugs || output?.[0]?.bug || "";

  // Handle copy to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text || "").then(
      () => {
        toast.success("Copied Successfully");
      },
      (error) => {
        console.error("Failed to copy text: ", error);
      }
    );
  };

   useEffect(() => {
     // Register a custom language (Optional)
     monaco.languages.register({ id: "customLang" });

     monaco.languages.setMonarchTokensProvider("customLang", {
       tokenizer: {
         root: [
           [/\b(function|return|if|else|const|let|var)\b/, "keyword"],
           [/\b(console|log)\b/, "variable"],
           [/"[^"]*"/, "string"],
           [/[{}()\[\]]/, "delimiter"],
         ],
       },
     });

     // Define a custom theme (✅ Fix: Added colors property)
     monaco.editor.defineTheme("customTheme", {
       base: "vs-dark",
       inherit: true,
       rules: [
         { token: "keyword", foreground: "ff007f", fontStyle: "bold" },
         { token: "string", foreground: "FFA500" },
         { token: "variable", foreground: "00FF00" },
       ],
       colors: {
         "editor.background": "#1e1e1e", // Dark background
         "editor.foreground": "#d4d4d4", // Default text color
         "editor.lineHighlightBackground": "#2a2d2e",
         "editorCursor.foreground": "#ffcc00",
       },
     });

     monaco.editor.setTheme("customTheme");
   }, []);

  console.log(text)
  console.log(output)

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
            <Button onClick={handleAIQuery} disabled={loading}>
              <Sparkles />
              Generate Response
            </Button>
          </div>

          {/* AI Output Section */}
          <Dialog
            open={isOutputDialogOpen}
            onOpenChange={() => setIsOutputDialogOpen(false)}
          >
            <DialogContent className="max-h-[500px]">
              <DialogHeader>
                <DialogTitle>Output</DialogTitle>
                <DialogDescription asChild>
                  <div className="flex items-center justify-between">
                    <p>AI Generated</p>
                    {/* Copy Button with Tooltip */}
                    <div>
                      <Hint label="Copy code" side="top">
                        <Button
                          variant="ghost"
                          onClick={() => handleCopy(code)}
                        >
                          <CopyIcon />
                        </Button>
                      </Hint>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="relative mt-1  overflow-y-auto">
                <MonacoEditor
                  height={"200px"}
                  language={language}
                  theme="vs-dark"
                  value={code || ""}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                  }}
                />
              </div>
              <div className="mt-4">
                <label htmlFor="explanation" className="block font-semibold">
                  <div className="flex items-center justify-between">
                    <p>Explanation:</p>
                    <div>
                      <Hint label="Copy explanation" side="top">
                        <Button
                          variant="ghost"
                          onClick={() => handleCopy(explanation)}
                        >
                          <CopyIcon />
                        </Button>
                      </Hint>
                    </div>
                  </div>
                </label>
                <textarea
                  id="explanation"
                  value={explanation || ""}
                  readOnly
                  placeholder="Enter the explanation here"
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  rows={4}
                />
              </div>

              {/* Bug Information Field */}
              <div className="mt-4">
                <label htmlFor="bug" className="block font-semibold">
                  <div className="flex items-center justify-between">
                    <p>Bug:</p>
                    <div>
                      <Hint label="Copy Bug" side="top">
                        <Button
                          variant="ghost"
                          onClick={() => handleCopy(bugs)}
                        >
                          <CopyIcon />
                        </Button>
                      </Hint>
                    </div>
                  </div>
                </label>
                <textarea
                  id="bug"
                  value={bugs || ""}
                  readOnly
                  placeholder="Describe the bug here"
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  rows={4}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AIDialog;
