import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import blogService from '../services/blogService';
import MarkdownToolbar from '../components/editor/MarkdownToolbar';
import CoverUploader from '../components/editor/CoverUploader';
import TagInput from '../components/editor/TagInput';
import StylePicker from '../components/editor/StylePicker';
import BlogRenderer from '../components/blog/BlogRenderer';
import { calculateReadingTime, stripMarkdown } from '../utils/markdown';
import { 
  ArrowLeft, 
  Eye, 
  Edit3, 
  Save, 
  Send, 
  AlertCircle, 
  CheckCircle,
  Clock
} from 'lucide-react';

export default function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const textareaRef = useRef(null);

  // Form State
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [style, setStyle] = useState('EDITORIAL');
  const [status, setStatus] = useState('DRAFT');
  const [tags, setTags] = useState([]);

  // UI state
  const [viewMode, setViewMode] = useState('edit'); // 'edit' | 'preview'
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const isEditing = Boolean(id);

  // Load existing blog if editing
  useEffect(() => {
    if (!id) return;

    setFetching(true);
    blogService.getBlogById(id)
      .then((data) => {
        setTitle(data.title || '');
        setExcerpt(data.excerpt || '');
        setContent(data.content || '');
        setCoverImageUrl(data.coverImageUrl || '');
        setStyle(data.style || 'EDITORIAL');
        setStatus(data.status || 'DRAFT');
        if (data.tags) {
          setTags(data.tags.map(t => t.name || t));
        }
      })
      .catch((err) => {
        setErrorMessage(err.message || 'Failed to load blog for editing.');
      })
      .finally(() => {
        setFetching(false);
      });
  }, [id]);

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleSave = async (publishNow = false) => {
    if (!title.trim()) {
      setErrorMessage('Please enter a title for your blog.');
      setViewMode('edit');
      return;
    }
    if (!content.trim()) {
      setErrorMessage('Blog content cannot be empty.');
      setViewMode('edit');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const targetStatus = publishNow ? 'PUBLISHED' : (isEditing ? status : 'DRAFT');
    const autoExcerpt = excerpt.trim() || stripMarkdown(content, 160);

    const payload = {
      title: title.trim(),
      excerpt: autoExcerpt,
      content,
      coverImageUrl,
      style,
      status: targetStatus,
      tags: tags,
    };

    try {
      let savedBlog;
      if (isEditing) {
        const res = await blogService.updateBlog(id, payload);
        savedBlog = res.data;
        showToast(publishNow ? 'Blog published successfully!' : 'Changes saved successfully.');
      } else {
        const res = await blogService.createBlog(payload);
        savedBlog = res.data;
        showToast(publishNow ? 'Blog created & published!' : 'Draft saved successfully.');
      }

      setStatus(savedBlog.status);
      setSlug(savedBlog.slug);

      if (publishNow) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          navigate(`/dashboard`);
        }, 1200);
      } else if (!isEditing && savedBlog.id) {
        // Switch URL to edit mode so subsequent saves update rather than recreate
        navigate(`/editor/${savedBlog.id}`, { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const readingTime = calculateReadingTime(content);
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  if (fetching) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-500 font-medium">Loading story...</p>
      </div>
    );
  }

  // Construct preview mock object for real-time rendering
  const previewBlog = {
    title: title || 'Untitled Story',
    excerpt: excerpt || stripMarkdown(content, 160),
    content,
    coverImageUrl,
    style,
    status,
    publishedAt: status === 'PUBLISHED' ? new Date().toISOString() : null,
    readingTimeMinutes: readingTime,
    author: {
      displayName: user?.displayName || user?.username,
      username: user?.username,
      profileImageUrl: user?.profileImageUrl,
    },
    tags: tags.map(t => ({ name: t })),
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Sticky Top Editor Action Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Left Actions */}
          <div className="flex items-center space-x-3">
            <Link
              to="/dashboard"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                status === 'PUBLISHED' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {status}
              </span>
            </div>
          </div>

          {/* Center: Mode Switcher (Edit vs Preview) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('edit')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'edit'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'preview'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Style</span>
            </button>
          </div>

          {/* Right Actions: Save Draft & Publish */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSave(false)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold transition shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Save Draft</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleSave(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm hover:shadow hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>{status === 'PUBLISHED' ? 'Update Story' : 'Publish Story'}</span>
                </>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Toast & Error Alerts */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-4">
        {errorMessage && (
          <div className="p-4 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start space-x-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successToast && (
          <div className="p-4 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start space-x-3 animate-fade-in">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600" />
            <span>{successToast}</span>
          </div>
        )}
      </div>

      {/* Main Body: Edit View or Live Theme Preview */}
      {viewMode === 'edit' ? (
        <main className="max-w-4xl mx-auto w-full px-4 py-8 flex-grow">
          
          {/* Cover Image */}
          <CoverUploader 
            coverImageUrl={coverImageUrl} 
            setCoverImageUrl={setCoverImageUrl} 
          />

          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Story Title..."
            className="w-full text-3xl sm:text-5xl font-black text-slate-900 placeholder-slate-300 bg-transparent border-none focus:outline-none mb-4 leading-tight"
          />

          {/* Subtitle / Excerpt Input */}
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Add an excerpt or subtitle (optional, will auto-generate if empty)..."
            className="w-full text-base sm:text-lg text-slate-600 placeholder-slate-400 bg-transparent border-none focus:outline-none mb-8 italic"
          />

          {/* Theme Style Selector */}
          <StylePicker 
            selectedStyle={style} 
            setSelectedStyle={setStyle} 
          />

          {/* Tag Manager */}
          <TagInput 
            tags={tags} 
            setTags={setTags} 
          />

          {/* Markdown Formatting Toolbar */}
          <MarkdownToolbar 
            textareaRef={textareaRef} 
            content={content} 
            setContent={setContent} 
          />

          {/* Writing Area */}
          <div className="relative bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm mb-4">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tell your story using Markdown... Use the toolbar above to format headings, quotes, code, lists, and upload images."
              rows={16}
              className="w-full bg-transparent resize-y border-none focus:outline-none text-slate-800 text-base leading-relaxed font-mono sm:font-sans placeholder-slate-300"
            />

            {/* Word & Reading Time Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center space-x-3">
                <span>{wordCount} words</span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{readingTime} min read</span>
                </span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">Markdown format</span>
            </div>
          </div>

        </main>
      ) : (
        /* Live Theme Preview Mode */
        <div className="w-full flex-grow animate-fade-in">
          <div className="max-w-4xl mx-auto px-4 pt-4 pb-2 text-center text-xs text-slate-500 font-medium">
            Displaying live reader view in <strong className="text-slate-800">{style}</strong> theme
          </div>
          <BlogRenderer blog={previewBlog} />
        </div>
      )}

    </div>
  );
}
