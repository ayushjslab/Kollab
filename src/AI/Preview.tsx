"use client";

import * as React from "react";
import { AlertTriangleIcon } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { getResponse } from "./AIResponse";
import { CodePreview } from "./prompt";
import ReactMarkdown from "react-markdown"
interface PreviewProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface outputProps {
  output: string;
  dry_run: string;
  bug: string;
}

const Preview = ({ isOpen, onClose, code, setLoading }: PreviewProps) => {
  const PROMPT = `compile the code for this ${code}, ${CodePreview}`;
  const [result, setResult] = React.useState<outputProps[] | null>(null);

  React.useEffect(() => {
    const handleAIQuery = async () => {
      try {
        setLoading(true);
        const result = await getResponse(PROMPT);
        const cleanedString = result?.replace(/```json|```/g, "").trim();
        const parsedString =
          typeof cleanedString === "string"
            ? JSON.parse(cleanedString)
            : cleanedString;
        setResult(Array.isArray(parsedString) ? parsedString : []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    handleAIQuery();
  }, [code, PROMPT, setLoading]);

  // Filtered values (removing `\n` and styling properly)
  const output = result?.[0]?.output
  const dry_run = result?.[0]?.dry_run
  const bug = result?.[0]?.bug

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <div className="w-full max-w-[600px] mx-auto p-6 space-y-6">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-bold text-gray-800">
              Compiled Code
            </DrawerTitle>
          </DrawerHeader>

          {/* Terminal-like Output */}
          <div
            className="grid grid-rows-4 gap-4 overflow-y-auto max-h-[400px]"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#888 #f1f1f1",
              overflowY: "auto",
              maxHeight: "400px",
            }}
          >
            {/* Output */}
            <label
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#000",
                marginBottom: "8px",
              }}
            >
              Output
            </label>
            <div
              style={{
                backgroundColor: "#292F2D",
                color: "#F1C40F",
                padding: "16px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "18px",
              }}
              className="bg-[#292F2D] text-yellow-500 p-4 rounded-md font-semibold text-lg"
            >
              <ReactMarkdown>{output}</ReactMarkdown>
            </div>

            {/* Dry Run */}
            <label
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#000",
                marginBottom: "8px",
              }}
            >
              Dry Run
            </label>
            <div
              style={{
                backgroundColor: "#16A085",
                color: "#F1F1F1",
                padding: "16px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "18px",
              }}
              className="bg-teal-600 text-gray-800 p-4 rounded-md font-semibold text-lg"
            >
              <ReactMarkdown>{dry_run}</ReactMarkdown>
            </div>

            {/* Bug Alert */}
            <label
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#000",
                marginBottom: "8px",
              }}
              className="flex items-center gap-4 text-red-500"
            >
              Bug Alert
              <AlertTriangleIcon className="scale-110  text-red-500" />
            </label>
            <div
              style={{
                backgroundColor: "#E74C3C",
                color: "#F1F1F1",
                padding: "16px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              className="bg-red-600 text-gray-800 p-4 rounded-md font-semibold text-lg flex items-center gap-2"
            >
              <ReactMarkdown>{bug}</ReactMarkdown>
            </div>
          </div>

          {/* Close Button */}
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default Preview;
