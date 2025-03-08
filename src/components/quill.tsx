"use client";

import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css"; // You can choose your own highlight.js theme
import "quill/dist/quill.snow.css"; // Quill Snow Theme
import { Button } from "./ui/button";
import { CopyIcon, Cpu, EyeIcon } from "lucide-react";
import { toast } from "sonner";
import { Hint } from "./hint";
import AIDialog from "@/AI/AIDialog";
import Preview from "@/AI/Preview";

interface QuillEditorProps {
  value: string; // Quill Delta JSON string passed as prop
  tools?: boolean;
}

const QuillEditor = ({ value, tools = false }: QuillEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [quillInstance, setQuillInstance] = useState<Quill | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (!editorRef.current) return;

    const quill = new Quill(editorRef.current, {
      modules: {
        syntax: { hljs }, // Enable syntax highlighting
        toolbar: false, // Show code block button in the toolbar
      },
      theme: "snow",
    });

    // Set initial content using the passed Quill Delta value
    const delta = JSON.parse(value); // Parse the Delta JSON value
    quill.setContents(delta);

    // Apply syntax highlighting to existing code blocks
    quill.on("text-change", () => {
      document.querySelectorAll("pre.ql-syntax").forEach((el) => {
        hljs.highlightElement(el as HTMLElement);
      });
    });

    // Set the Quill instance in the state for later use
    setQuillInstance(quill);
  }, [value]);

  const copyToClipboard = () => {
    if (quillInstance) {
      // Get the plain text of the editor
      const text = quillInstance.getText();

      // Filter out any unwanted extra strings or formatting
      // Here we remove leading/trailing whitespace and unwanted characters
      const filteredText = text.trim().replace(/\n+/g, "\n"); // Example: Remove multiple newlines

      // Use the Clipboard API to copy the filtered text to the clipboard
      navigator.clipboard.writeText(filteredText).then(
        () => {
          toast.success("Coppied sucessfully!");
        },
        (error) => {
          console.error("Failed to copy text: ", error);
        }
      );
    }
  };

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState<boolean>(false);

  // Function to handle dialog open/close
  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const openPreviewDialog = () => {
    setIsPreviewDialogOpen(true);
  };

  const closePreviewDialog = () => {
    setIsPreviewDialogOpen(false);
  };

  return (
    <>
      {tools && (
        <div className="relative group mb-4 ml-1 mt-2 z-10">
          {/* The icons will be hidden by default and shown on hover */}
          <div className="absolute top-0 left-0 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-teal-600 border border-teal-700 rounded-full">
            {/* Copy Button */}
            <Hint label="Copy to clipboard">
              <Button
                variant="ghost"
                size="iconSm"
                onClick={copyToClipboard}
                className="rounded-full hover:bg-teal-300/20 text-white"
              >
                <CopyIcon className="size-4" />
              </Button>
            </Hint>

            {/* Preview Button */}
            <Hint label="Preview">
              <Button
                variant="ghost"
                size="iconSm"
                className="rounded-full hover:bg-teal-300/20 text-white"
                disabled={loading}
                onClick={() => {
                  openPreviewDialog();
                }}
              >
                <EyeIcon className="size-4" />
              </Button>
            </Hint>

            {/* AI Button */}
            <Hint label="AI">
              <Button
                variant="ghost"
                size="iconSm"
                className="rounded-full hover:bg-teal-300/20 text-white"
                onClick={() => {
                  openDialog();
                }}
              >
                <Cpu className="size-4" />
              </Button>
            </Hint>
          </div>
        </div>
      )}
      <div ref={editorRef} className="quill-editorCB" />
      <AIDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        value={value}
        text={quillInstance?.getText() || ""}
      />
      <Preview
        isOpen={isPreviewDialogOpen}
        onClose={closePreviewDialog}
        code={quillInstance?.getText() || ""}
        setLoading={setLoading}
      />
    </>
  );
};

export default QuillEditor;
