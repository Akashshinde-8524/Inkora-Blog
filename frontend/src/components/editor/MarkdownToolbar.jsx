import React, { useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Heading3, 
  Quote, 
  Code, 
  List, 
  ListOrdered, 
  Link2, 
  Image as ImageIcon, 
  Minus,
  Upload
} from 'lucide-react';
import uploadService from '../../services/uploadService';

export default function MarkdownToolbar({ textareaRef, content, setContent }) {
  const fileInputRef = useRef(null);

  const insertText = (before, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || 'text';

    const replacement = `${before}${selectedText}${after}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    
    setContent(newContent);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 10);
  };

  const handleInlineImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await uploadService.uploadImage(file, 'content');
      insertText(`\n![${file.name}](${data.url})\n`);
    } catch (err) {
      alert(err.message || 'Failed to upload inline image');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-100 border border-slate-200 rounded-xl mb-3 text-slate-700">
      
      {/* Headings */}
      <button
        type="button"
        title="Heading 1"
        onClick={() => insertText('\n# ', '\n')}
        className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
      >
        <Heading1 className="w-4 h-4" />
      </button>

      <button
        type="button"
        title="Heading 2"
        onClick={() => insertText('\n## ', '\n')}
        className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <button
        type="button"
        title="Heading 3"
        onClick={() => insertText('\n### ', '\n')}
        className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
      >
        <Heading3 className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-slate-300 mx-1"></div>

      {/* Formatting */}
      <button
        type="button"
        title="Bold"
        onClick={() => insertText('**', '**')}
        className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
      >
        <Bold className="w-4 h-4" />
      </button>

      <button
        type="button"
        title="Italic"
        onClick={() => insertText('*', '*')}
        className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
      >
        <Italic className="w-4 h-4" />
      </button>

      <button
        type="button"
        title="Blockquote"
        onClick={() => insertText('\n> ', '\n')}
        className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
      >
        <Quote className="w-4 h-4" />
      </button>

      <button
        type="button"
        title="Code Block"
        onClick={() => insertText('\n```\n', '\n```\n')}
        className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
      >
        <Code className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-slate-300 mx-1"></div>

      {/* Lists */}
      <button
        type="button"
        title="Bullet List"
        onClick={() => insertText('\n* ', '\n')}
        className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
      >
        <List className="w-4 h-4" />
      </button>

      <button
        type="button"
        title="Numbered List"
        onClick={() => insertText('\n1. ', '\n')}
        className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <button
        type="button"
        title="Horizontal Divider"
        onClick={() => insertText('\n\n---\n\n')}
        className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
      >
        <Minus className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-slate-300 mx-1"></div>

      {/* Links & Images */}
      <button
        type="button"
        title="Insert Link"
        onClick={() => insertText('[Link Title](', ')')}
        className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
      >
        <Link2 className="w-4 h-4" />
      </button>

      <button
        type="button"
        title="Insert Image by URL"
        onClick={() => insertText('![Image description](', ')')}
        className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
      >
        <ImageIcon className="w-4 h-4" />
      </button>

      <button
        type="button"
        title="Upload Image into Content"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold hover:bg-blue-50 hover:text-blue-600 transition"
      >
        <Upload className="w-3.5 h-3.5" />
        <span>Upload Image</span>
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInlineImageUpload}
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
      />

    </div>
  );
}
