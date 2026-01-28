'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { useEffect, useState, useRef } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Link as LinkIcon,
  Table as TableIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Columns3,
  Rows3,
  TableProperties,
  Trash2,
  Plus,
  Search,
  Code,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImagePickerDialog } from './image-picker-dialog';
import { FindReplaceDialog } from './find-replace-dialog';
import { ReportImage } from '@/lib/types/reports';
import { beautifyHtml, minifyHtml } from '@/lib/utils/html-beautifier';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  reportId?: number | string;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = 'Start writing...',
  className,
  reportId,
}: TiptapEditorProps) {
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState(false);
  const [showHtmlCode, setShowHtmlCode] = useState(false);
  const [htmlCode, setHtmlCode] = useState('');
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [floatingMenuPosition, setFloatingMenuPosition] = useState({ top: 0, left: 0 });
  const floatingMenuRef = useRef<HTMLDivElement>(null);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: 'tiptap-image',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'tiptap-table',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'tiptap-table-row',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'tiptap-table-cell',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'tiptap-table-header',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[300px] p-4',
      },
      handlePaste: (view, event) => {
        const clipboardData = event.clipboardData;
        if (!clipboardData) return false;

        // Check for HTML content first (from our Copy button)
        const htmlContent = clipboardData.getData('text/html');
        if (htmlContent) {
          // Try to extract image src from HTML
          const imgMatch = htmlContent.match(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/i);
          if (imgMatch) {
            const src = imgMatch[1];
            const alt = imgMatch[2] || '';

            // Insert the image using the URL
            view.dispatch(
              view.state.tr.replaceSelectionWith(
                view.state.schema.nodes.image.create({
                  src,
                  alt,
                })
              )
            );
            return true;
          }
        }

        // Check for plain text URL
        const plainText = clipboardData.getData('text/plain');
        if (plainText) {
          // Check if it's a URL pointing to an image
          const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i;
          if (urlPattern.test(plainText.trim())) {
            // Insert as image
            view.dispatch(
              view.state.tr.replaceSelectionWith(
                view.state.schema.nodes.image.create({
                  src: plainText.trim(),
                  alt: '',
                })
              )
            );
            return true;
          }
        }

        // Let TipTap handle normally
        return false;
      },
    },
  });

  // Sync editor content when the content prop changes from outside
  useEffect(() => {
    if (!editor) return;

    // Get current editor content as HTML
    const currentContent = editor.getHTML();

    // Only update if the content is different to avoid unnecessary updates
    // and prevent cursor jumping while typing
    if (content !== currentContent) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  // Handle floating menu visibility and positioning
  useEffect(() => {
    if (!editor) return;

    const updateFloatingMenu = () => {
      const { selection } = editor.state;
      const { from, to } = selection;

      // Only show menu if there's a text selection (not just cursor position)
      if (from === to) {
        setShowFloatingMenu(false);
        return;
      }

      // Get the coordinates of the selection
      const { view } = editor;
      const start = view.coordsAtPos(from);
      const end = view.coordsAtPos(to);

      // Calculate position (centered above selection)
      const left = (start.left + end.left) / 2;
      const top = start.top;

      // Position the menu above the selection
      setFloatingMenuPosition({
        top: top - 50, // Offset above the selection
        left: left,
      });
      setShowFloatingMenu(true);
    };

    // Update on selection change
    editor.on('selectionUpdate', updateFloatingMenu);
    editor.on('blur', () => {
      // Delay hiding to allow clicking menu buttons
      setTimeout(() => setShowFloatingMenu(false), 200);
    });

    return () => {
      editor.off('selectionUpdate', updateFloatingMenu);
      editor.off('blur');
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const insertImage = (image: ReportImage) => {
    editor
      .chain()
      .focus()
      .setImage({
        src: image.imageUrl,
        alt: image.title || 'Report image',
        title: image.title || undefined,
      })
      .run();
  };

  const alignImageLeft = () => {
    editor
      .chain()
      .focus()
      .updateAttributes('image', {
        class: 'tiptap-image tiptap-image-left',
      })
      .run();
  };

  const alignImageCenter = () => {
    editor
      .chain()
      .focus()
      .updateAttributes('image', {
        class: 'tiptap-image tiptap-image-center',
      })
      .run();
  };

  const alignImageRight = () => {
    editor
      .chain()
      .focus()
      .updateAttributes('image', {
        class: 'tiptap-image tiptap-image-right',
      })
      .run();
  };

  const setImageWidth = (width: string) => {
    const currentAttrs = editor.getAttributes('image');
    const currentClass = currentAttrs.class || 'tiptap-image';

    // Remove any existing width style
    let style = currentAttrs.style || '';
    style = style.replace(/max-width:\s*\d+%;?/g, '').trim();

    // Add new width
    if (width === '100') {
      // Full width, no max-width needed
      style = style || undefined;
    } else {
      style = `${style} max-width: ${width}%;`.trim();
    }

    editor
      .chain()
      .focus()
      .updateAttributes('image', {
        class: currentClass,
        style: style || undefined,
      })
      .run();
  };

  const toggleHtmlView = () => {
    if (!showHtmlCode) {
      // Switching to HTML view - get current HTML from editor and beautify it
      const rawHtml = editor.getHTML();
      const beautifiedHtml = beautifyHtml(rawHtml);
      setHtmlCode(beautifiedHtml);
    } else {
      // Switching back to visual view - minify HTML and update editor
      const minifiedHtml = minifyHtml(htmlCode);
      editor.commands.setContent(minifiedHtml);
      onChange(minifiedHtml);
    }
    setShowHtmlCode(!showHtmlCode);
  };

  const handleHtmlCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHtmlCode(e.target.value);
  };

  return (
    <div className={cn('border rounded-md', className)}>
      {/* Toolbar */}
      <div className="sticky top-0 z-10 border-b p-2 flex flex-wrap gap-1 bg-muted/50">
        {/* Text formatting */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-muted' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-muted' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'bg-muted' : ''}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-8" />

        {/* Headings */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={editor.isActive('heading', { level: 4 }) ? 'bg-muted' : ''}
        >
          <Heading4 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          className={editor.isActive('heading', { level: 5 }) ? 'bg-muted' : ''}
        >
          <Heading5 className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-8" />

        {/* Lists */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-muted' : ''}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-muted' : ''}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-8" />

        {/* Alignment */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'bg-muted' : ''}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'bg-muted' : ''}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'bg-muted' : ''}
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={editor.isActive({ textAlign: 'justify' }) ? 'bg-muted' : ''}
        >
          <AlignJustify className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-8" />

        {/* Link & Table */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addLink}
          className={editor.isActive('link') ? 'bg-muted' : ''}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <Button type="button" variant="ghost" size="sm" onClick={insertTable}>
          <TableIcon className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsImagePickerOpen(true)}
          disabled={!reportId}
          title={!reportId ? 'Save report to add images' : 'Insert image'}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-8" />

        {/* Find & Replace */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsFindReplaceOpen(true)}
          title="Find and Replace"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* HTML Code View Toggle */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleHtmlView}
          className={showHtmlCode ? 'bg-muted' : ''}
          title={showHtmlCode ? 'Switch to visual editor' : 'View HTML code'}
        >
          {showHtmlCode ? <Eye className="h-4 w-4" /> : <Code className="h-4 w-4" />}
        </Button>

        {/* Table manipulation controls - only show when inside a table */}
        {editor.isActive('table') && (
          <>
            <Separator orientation="vertical" className="h-8" />

            {/* Row operations */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().addRowBefore().run()}
              title="Add row before"
            >
              <Plus className="h-3 w-3" />
              <Rows3 className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              title="Add row after"
            >
              <Rows3 className="h-4 w-4" />
              <Plus className="h-3 w-3" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().deleteRow().run()}
              title="Delete row"
            >
              <Rows3 className="h-4 w-4" />
              <Trash2 className="h-3 w-3" />
            </Button>

            <Separator orientation="vertical" className="h-8" />

            {/* Column operations */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              title="Add column before"
            >
              <Plus className="h-3 w-3" />
              <Columns3 className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              title="Add column after"
            >
              <Columns3 className="h-4 w-4" />
              <Plus className="h-3 w-3" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().deleteColumn().run()}
              title="Delete column"
            >
              <Columns3 className="h-4 w-4" />
              <Trash2 className="h-3 w-3" />
            </Button>

            <Separator orientation="vertical" className="h-8" />

            {/* Cell operations */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().mergeCells().run()}
              disabled={!editor.can().mergeCells()}
              title="Merge cells"
            >
              <TableProperties className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().splitCell().run()}
              disabled={!editor.can().splitCell()}
              title="Split cell"
            >
              <TableProperties className="h-4 w-4 rotate-180" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeaderRow().run()}
              title="Toggle header row"
            >
              <Rows3 className="h-4 w-4 font-bold" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
              title="Toggle header column"
            >
              <Columns3 className="h-4 w-4 font-bold" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().deleteTable().run()}
              title="Delete table"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </>
        )}

        {/* Image alignment controls - only show when an image is selected */}
        {editor.isActive('image') && (
          <>
            <Separator orientation="vertical" className="h-8" />

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={alignImageLeft}
              title="Align image left"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={alignImageCenter}
              title="Align image center"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={alignImageRight}
              title="Align image right"
            >
              <AlignRight className="h-4 w-4" />
            </Button>

            <Select onValueChange={setImageWidth} defaultValue="100">
              <SelectTrigger className="w-24 h-8">
                <SelectValue placeholder="Width" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25%</SelectItem>
                <SelectItem value="50">50%</SelectItem>
                <SelectItem value="75">75%</SelectItem>
                <SelectItem value="100">100%</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}

        <Separator orientation="vertical" className="h-8" />

        {/* Undo/Redo */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Floating Menu - appears near selected text */}
      {showFloatingMenu && (
        <div
          ref={floatingMenuRef}
          className="fixed z-50 flex items-center gap-1 p-1 bg-popover border rounded-md shadow-lg"
          style={{
            top: `${floatingMenuPosition.top}px`,
            left: `${floatingMenuPosition.left}px`,
            transform: 'translateX(-50%)',
          }}
          onMouseDown={e => e.preventDefault()} // Prevent blur when clicking menu
        >
          {/* Quick formatting options */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-muted' : ''}
          >
            <Bold className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-muted' : ''}
          >
            <Italic className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'bg-muted' : ''}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
          >
            <Heading1 className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
          >
            <Heading2 className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
          >
            <Heading3 className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            className={editor.isActive('heading', { level: 4 }) ? 'bg-muted' : ''}
          >
            <Heading4 className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
            className={editor.isActive('heading', { level: 5 }) ? 'bg-muted' : ''}
          >
            <Heading5 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Editor content */}
      {showHtmlCode ? (
        <div className="relative">
          <textarea
            value={htmlCode}
            onChange={handleHtmlCodeChange}
            className="w-full min-h-[300px] max-h-[600px] p-4 font-mono text-sm focus:outline-none resize-y bg-muted/30 border-0"
            placeholder="HTML code will appear here..."
            spellCheck={false}
          />
          <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
            HTML Code View
          </div>
        </div>
      ) : (
        <EditorContent editor={editor} />
      )}

      {/* Image Picker Dialog */}
      {reportId && (
        <ImagePickerDialog
          reportId={reportId}
          open={isImagePickerOpen}
          onClose={() => setIsImagePickerOpen(false)}
          onSelect={insertImage}
        />
      )}

      {/* Find and Replace Dialog */}
      <FindReplaceDialog
        editor={editor}
        open={isFindReplaceOpen}
        onClose={() => setIsFindReplaceOpen(false)}
      />
    </div>
  );
}
