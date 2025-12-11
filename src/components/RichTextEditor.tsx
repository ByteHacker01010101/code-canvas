import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import Link from '@tiptap/extension-link';
import { ResizableImage } from './ResizableImage';
import { useState } from 'react';
import { FileUploadDialog } from './FileUploadDialog';
import { ShapeInsertDialog } from './ShapeInsertDialog';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  ImageIcon,
  Paperclip,
  Link2,
  Shapes,
  Palette,
  Type,
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor, onOpenFileUpload, onOpenShapeInsert }: any) => {
  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const colors = [
    { label: 'Default', value: '#000000', dark: '#ffffff' },
    { label: 'Red', value: '#ef4444', dark: '#f87171' },
    { label: 'Orange', value: '#f97316', dark: '#fb923c' },
    { label: 'Yellow', value: '#eab308', dark: '#facc15' },
    { label: 'Green', value: '#22c55e', dark: '#4ade80' },
    { label: 'Blue', value: '#3b82f6', dark: '#60a5fa' },
    { label: 'Purple', value: '#a855f7', dark: '#c084fc' },
    { label: 'Pink', value: '#ec4899', dark: '#f472b6' },
  ];

  const fonts = [
    { label: 'Sans Serif', value: 'Inter, system-ui, sans-serif' },
    { label: 'Serif', value: 'Georgia, serif' },
    { label: 'Mono', value: 'Monaco, monospace' },
    { label: 'Display', value: 'Playfair Display, serif' },
  ];

  return (
    <div className="border-b border-border/50 bg-gradient-to-r from-muted/50 via-background to-muted/50 p-2 flex flex-wrap gap-1 items-center sticky top-0 z-10 rounded-t-xl backdrop-blur-sm">
      {/* Font Family */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2">
            <Type className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">Font</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2 bg-card/95 backdrop-blur-xl">
          {fonts.map((font) => (
            <Button
              key={font.value}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm"
              style={{ fontFamily: font.value }}
              onClick={() => editor.chain().focus().setFontFamily(font.value).run()}
            >
              {font.label}
            </Button>
          ))}
        </PopoverContent>
      </Popover>

      {/* Text Color */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">Color</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3 bg-card/95 backdrop-blur-xl">
          <div className="grid grid-cols-4 gap-2">
            {colors.map((color) => (
              <button
                key={color.value}
                className="w-8 h-8 rounded-lg border-2 border-border hover:scale-110 transition-transform shadow-sm"
                style={{ backgroundColor: color.value }}
                onClick={() => editor.chain().focus().setColor(color.value).run()}
                title={color.label}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Text Formatting */}
      <div className="flex items-center bg-muted/50 rounded-lg p-0.5">
        <Toggle
          size="sm"
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          className="h-7 w-7 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground rounded-md"
        >
          <Bold className="h-3.5 w-3.5" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          className="h-7 w-7 data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground rounded-md"
        >
          <Italic className="h-3.5 w-3.5" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive('underline')}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          className="h-7 w-7 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground rounded-md"
        >
          <UnderlineIcon className="h-3.5 w-3.5" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive('strike')}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          className="h-7 w-7 data-[state=on]:bg-muted-foreground/20 rounded-md"
        >
          <Strikethrough className="h-3.5 w-3.5" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive('highlight')}
          onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
          className="h-7 w-7 data-[state=on]:bg-warning data-[state=on]:text-warning-foreground rounded-md"
        >
          <Highlighter className="h-3.5 w-3.5" />
        </Toggle>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Headings */}
      <div className="flex items-center bg-muted/50 rounded-lg p-0.5">
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 1 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className="h-7 w-7 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground rounded-md"
        >
          <Heading1 className="h-3.5 w-3.5" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 2 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="h-7 w-7 data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground rounded-md"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 3 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className="h-7 w-7 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground rounded-md"
        >
          <Heading3 className="h-3.5 w-3.5" />
        </Toggle>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Lists */}
      <div className="flex items-center bg-muted/50 rounded-lg p-0.5">
        <Toggle
          size="sm"
          pressed={editor.isActive('bulletList')}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          className="h-7 w-7 data-[state=on]:bg-success data-[state=on]:text-success-foreground rounded-md"
        >
          <List className="h-3.5 w-3.5" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive('orderedList')}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          className="h-7 w-7 data-[state=on]:bg-success data-[state=on]:text-success-foreground rounded-md"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </Toggle>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Alignment */}
      <div className="flex items-center bg-muted/50 rounded-lg p-0.5">
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: 'left' })}
          onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
          className="h-7 w-7 data-[state=on]:bg-muted-foreground/20 rounded-md"
        >
          <AlignLeft className="h-3.5 w-3.5" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: 'center' })}
          onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
          className="h-7 w-7 data-[state=on]:bg-muted-foreground/20 rounded-md"
        >
          <AlignCenter className="h-3.5 w-3.5" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: 'right' })}
          onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
          className="h-7 w-7 data-[state=on]:bg-muted-foreground/20 rounded-md"
        >
          <AlignRight className="h-3.5 w-3.5" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: 'justify' })}
          onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()}
          className="h-7 w-7 data-[state=on]:bg-muted-foreground/20 rounded-md"
        >
          <AlignJustify className="h-3.5 w-3.5" />
        </Toggle>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Media & Files */}
      <div className="flex items-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-0.5">
        <Toggle
          size="sm"
          onPressedChange={onOpenFileUpload}
          className="h-7 w-7 hover:bg-primary/20 rounded-md"
        >
          <ImageIcon className="h-3.5 w-3.5" />
        </Toggle>

        <Toggle
          size="sm"
          onPressedChange={onOpenFileUpload}
          className="h-7 w-7 hover:bg-secondary/20 rounded-md"
        >
          <Paperclip className="h-3.5 w-3.5" />
        </Toggle>

        <Toggle
          size="sm"
          onPressedChange={onOpenShapeInsert}
          className="h-7 w-7 hover:bg-accent/20 rounded-md"
        >
          <Shapes className="h-3.5 w-3.5" />
        </Toggle>

        <Toggle
          size="sm"
          onPressedChange={addLink}
          pressed={editor.isActive('link')}
          className="h-7 w-7 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground rounded-md"
        >
          <Link2 className="h-3.5 w-3.5" />
        </Toggle>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Other */}
      <Toggle
        size="sm"
        pressed={editor.isActive('blockquote')}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        className="h-7 w-7 data-[state=on]:bg-muted rounded-md"
      >
        <Quote className="h-3.5 w-3.5" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive('code')}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
        className="h-7 w-7 data-[state=on]:bg-muted rounded-md"
      >
        <Code className="h-3.5 w-3.5" />
      </Toggle>

      <div className="flex-1" />

      {/* Undo/Redo */}
      <div className="flex items-center gap-0.5">
        <Toggle
          size="sm"
          onPressedChange={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-7 w-7 rounded-md"
        >
          <Undo className="h-3.5 w-3.5" />
        </Toggle>

        <Toggle
          size="sm"
          onPressedChange={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-7 w-7 rounded-md"
        >
          <Redo className="h-3.5 w-3.5" />
        </Toggle>
      </div>
    </div>
  );
};

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = 'Start writing your amazing content...',
}: RichTextEditorProps) => {
  const [fileUploadOpen, setFileUploadOpen] = useState(false);
  const [shapeInsertOpen, setShapeInsertOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontFamily,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      ResizableImage,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer hover:text-primary/80 transition-colors',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-6 bg-card text-foreground',
      },
    },
  });

  const handleFileUploaded = (url: string, type: "image" | "file") => {
    if (!editor) return;

    if (type === "image") {
      editor.chain().focus().setResizableImage({ src: url }).run();
    } else {
      const fileName = url.split("/").pop() || "file";
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${url}" target="_blank">${fileName}</a>`)
        .run();
    }
  };

  const handleShapeSelected = (dataUrl: string) => {
    if (!editor) return;
    editor.chain().focus().setResizableImage({ src: dataUrl }).run();
  };

  return (
    <>
      <div className="border border-border/50 rounded-xl overflow-hidden shadow-xl bg-card/50 backdrop-blur-sm">
        <MenuBar 
          editor={editor} 
          onOpenFileUpload={() => setFileUploadOpen(true)}
          onOpenShapeInsert={() => setShapeInsertOpen(true)}
        />
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>
      
      <FileUploadDialog
        open={fileUploadOpen}
        onOpenChange={setFileUploadOpen}
        onFileUploaded={handleFileUploaded}
      />

      <ShapeInsertDialog
        open={shapeInsertOpen}
        onOpenChange={setShapeInsertOpen}
        onShapeSelected={handleShapeSelected}
      />
    </>
  );
};
