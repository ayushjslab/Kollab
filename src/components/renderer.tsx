import Quill from "quill";
import { useEffect, useRef, useState } from "react";

interface RendererProps {
    value: string;
};

const Renderer = ({value}: RendererProps) => {
    const [isEmpty, setIstEmpty] = useState(false);
    const rendererRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(!rendererRef.current) return;
        
        const container = rendererRef.current;

        const quill = new Quill(document.createElement("div"), {
            theme: "snow",
        })

        quill.enable(false);

        const contents = JSON.parse(value);
        quill.setContents(contents);

        const isEmpty = quill.getText().replace(/<(.|\n)*?>/g,"").trim().length === 0;
        setIstEmpty(isEmpty);

        container.innerHTML = quill.root.innerHTML;

        return () => {
            if(container) {
                container.innerHTML = "";
            }
        }
    },[value]);

    if(isEmpty) return null;

    if(value.includes("code-block")){
        console.log("yes")
    }

    return (
        <div ref={rendererRef} className="ql-editor ql-renderer"/>
    )
}

export default Renderer