import { PiTextAa } from "react-icons/pi";
import { MdSend } from "react-icons/md";
import Quill, { Delta, Op, type QuillOptions } from "quill";
import "quill/dist/quill.snow.css";
import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Button } from "./ui/button";
import { ImageIcon, Smile, XIcon } from "lucide-react";
import { Hint } from "./hint";
import { cn } from "@/lib/utils";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css"; 
import { EmojiPopover } from "./exmoji-popover";
import Image from "next/image";

type EditorValue = {
  image: File | null;
  body: string;
};

interface EditorProps {
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholdre?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  variant?: "create" | "update";
}

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }], // Headers (H1, H2, H3, Normal)
  ["bold", "italic", "underline", "strike"], // Basic text formatting
  [{ color: [] }, { background: [] }], // Text color and background
  [{ script: "sub" }, { script: "super" }], // Subscript / Superscript
  [{ list: "ordered" }, { list: "bullet" }], // Ordered and unordered lists
  [{ align: [] }], // Text alignment options
  ["blockquote", "code-block"], // Block types
  ["link"], // Insert media (links, images, videos)
  [{ direction: "rtl" }], // Right-to-left text support
  [{ size: ["small", false, "large", "huge"] }], // Font sizes
  [{ font: [] }], // Font family selector
  ["clean"], // Remove formatting
];

const Editor = ({
  onCancel,
  onSubmit,
  placeholdre = "Write somwthing...",
  defaultValue = [],
  disabled = false,
  innerRef,
  variant = "create",
}: EditorProps) => {
  const [text, setText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const [image, setImage] = useState<File | null>(null);

  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholdre);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);
  const imageElementRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholdre;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        syntax: { hljs },
        toolbar: toolbarOptions,
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                const text = quill.getText();
                const addedImage = imageElementRef.current?.files?.[0] || null;

                const isEmpty =
                  !addedImage &&
                  text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

                if (isEmpty) return;

                const body = JSON.stringify(quill.getContents());

                submitRef.current?.({ body, image: addedImage });
                return;
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = "";
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);

  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  const toggleToolbar = () => {
    setIsToolbarVisible((current) => !current);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");

    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };

  const onEmojiSelect = (emojiValue: string) => {
    const quill = quillRef.current;

    quill?.insertText(quill?.getSelection()?.index || 0, emojiValue);
  };

  return (
    <div className="flex flex-col">
      <input
        type="file"
        accept="image/*"
        ref={imageElementRef}
        onChange={(event) => setImage(event.target.files![0])}
        className="hidden"
      />
      <div
        className={cn(
          "flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white",
          disabled && "opacity-50"
        )}
      >
        <div ref={containerRef} className="h-full ql-custom" />
        {!!image && (
          <div className="p-2">
            <div className="relative size-[62px] flex items-center justify-center group/image">
              <Hint label="remove image">
                <button
                  onClick={() => {
                    setImage(null);
                    imageElementRef.current!.value = "";
                  }}
                  className="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center"
                >
                  <XIcon className="size-3.5" />
                </button>
              </Hint>
              <Image
                src={URL.createObjectURL(image)}
                alt="Uploaded"
                fill
                className="rounded-xl overflow-hidden border object-cover"
              />
            </div>
          </div>
        )}
        <div className="flex px-2 pb-2 z-[5]">
          <Hint label={isToolbarVisible ? "Hide formating" : "Show formating"}>
            <Button
              className=""
              disabled={disabled}
              size={"iconSm"}
              variant={"ghost"}
              onClick={toggleToolbar}
            >
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <Hint label="Emoji">
            <EmojiPopover onEmojiSelect={onEmojiSelect}>
              <Button
                className=""
                disabled={disabled}
                size={"iconSm"}
                variant={"ghost"}
              >
                <Smile className="size-4" />
              </Button>
            </EmojiPopover>
          </Hint>
          {variant === "create" && (
            <Hint label="Image">
              <Button
                className=""
                disabled={disabled}
                size={"iconSm"}
                variant={"ghost"}
                onClick={() => imageElementRef.current?.click()}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}
          {variant === "update" && (
            <div className=" ml-auto items-center gap-x-2">
              <Button
                className=""
                variant={"outline"}
                size={"sm"}
                onClick={onCancel}
                disabled={disabled}
              >
                Cancel
              </Button>
              <Button
                disabled={disabled || isEmpty}
                onClick={() => {
                  onSubmit({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    image,
                  });
                }}
                size={"sm"}
                className="ml-auto bg-teal-500 hover:bg-teal-500/80 text-white"
              >
                Save
              </Button>
            </div>
          )}
          {variant === "create" && (
            <Button
              disabled={disabled || isEmpty}
              size={"sm"}
              onClick={() => {
                onSubmit({
                  body: JSON.stringify(quillRef.current?.getContents()),
                  image,
                });
              }}
              className={cn(
                "ml-auto",
                isEmpty
                  ? " bg-white hover:bg-white text-muted-foreground"
                  : " bg-teal-500 hover:bg-teal-500/80 text-white"
              )}
            >
              <MdSend className="size-4" />
            </Button>
          )}
        </div>
      </div>
      {variant === "create" && (
        <div
          className={cn(
            "p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition",
            !isEmpty && "opacity-100"
          )}
        >
          <p>
            <strong>Shift + Return</strong> to add a new line
          </p>
        </div>
      )}
    </div>
  );
};

export default Editor;
