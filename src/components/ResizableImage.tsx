import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Trash2, Maximize2, Minimize2 } from "lucide-react";

const ResizableImageComponent = ({ node, updateAttributes, deleteNode }: any) => {
  const [showControls, setShowControls] = useState(false);
  const width = node.attrs.width || 100;

  return (
    <NodeViewWrapper
      className="relative inline-block group my-4"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="relative" style={{ width: `${width}%` }}>
        <img
          src={node.attrs.src}
          alt={node.attrs.alt || ""}
          className="w-full h-auto rounded-lg shadow-lg transition-all duration-300"
          draggable={false}
        />
        {showControls && (
          <div className="absolute -bottom-12 left-0 right-0 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl z-20 flex items-center gap-3">
            <Minimize2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Slider
              value={[width]}
              onValueChange={(value) => updateAttributes({ width: value[0] })}
              min={25}
              max={100}
              step={5}
              className="flex-1"
            />
            <Maximize2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Button
              variant="destructive"
              size="icon"
              className="h-7 w-7 flex-shrink-0"
              onClick={deleteNode}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    resizableImage: {
      setResizableImage: (options: { src: string; alt?: string; title?: string }) => ReturnType;
    };
  }
}

export const ResizableImage = Node.create({
  name: "resizableImage",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: { default: 100 },
    };
  },

  parseHTML() {
    return [{ tag: "img[src]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "img",
      mergeAttributes(HTMLAttributes, {
        style: `width: ${HTMLAttributes.width}%`,
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },

  addCommands() {
    return {
      setResizableImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
