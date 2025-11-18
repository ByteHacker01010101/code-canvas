import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Circle, Square, Triangle } from "lucide-react";

interface ShapeInsertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShapeSelected: (svg: string) => void;
}

export const ShapeInsertDialog = ({
  open,
  onOpenChange,
  onShapeSelected,
}: ShapeInsertDialogProps) => {
  const shapes = [
    {
      name: "Circle",
      icon: Circle,
      svg: '<svg width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#3b82f6" /></svg>',
      color: "primary",
    },
    {
      name: "Square",
      icon: Square,
      svg: '<svg width="100" height="100" viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" fill="#a855f7" /></svg>',
      color: "secondary",
    },
    {
      name: "Triangle",
      icon: Triangle,
      svg: '<svg width="100" height="100" viewBox="0 0 100 100"><path d="M 50 10 L 90 80 L 10 80 Z" fill="#ec4899" /></svg>',
      color: "accent",
    },
    {
      name: "Star",
      icon: Circle,
      svg: '<svg width="100" height="100" viewBox="0 0 100 100"><path d="M 50 10 L 61 39 L 92 39 L 68 58 L 78 87 L 50 68 L 22 87 L 32 58 L 8 39 L 39 39 Z" fill="#eab308" /></svg>',
      color: "warning",
    },
    {
      name: "Arrow Right",
      icon: Square,
      svg: '<svg width="120" height="60" viewBox="0 0 120 60"><path d="M 0 20 L 80 20 L 80 0 L 120 30 L 80 60 L 80 40 L 0 40 Z" fill="#22c55e" /></svg>',
      color: "success",
    },
    {
      name: "Hexagon",
      icon: Circle,
      svg: '<svg width="100" height="100" viewBox="0 0 100 100"><path d="M 50 5 L 85 25 L 85 65 L 50 85 L 15 65 L 15 25 Z" fill="#f97316" /></svg>',
      color: "warning",
    },
  ];

  const handleShapeClick = (svg: string) => {
    const base64 = btoa(svg);
    const dataUrl = `data:image/svg+xml;base64,${base64}`;
    onShapeSelected(dataUrl);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Circle className="h-5 w-5 text-primary" />
            Insert Shape
          </DialogTitle>
          <DialogDescription>
            Choose a shape to insert into your content
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 py-4">
          {shapes.map((shape) => (
            <Button
              key={shape.name}
              variant="outline"
              className="h-32 flex flex-col gap-2 hover:scale-105 transition-transform"
              onClick={() => handleShapeClick(shape.svg)}
            >
              <div dangerouslySetInnerHTML={{ __html: shape.svg }} />
              <span className="text-sm font-medium">{shape.name}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
