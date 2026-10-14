import React from 'react';
import { Calendar, Clock } from 'lucide-react';

export default function MinimalTheme({ blog, contentHtml }) {
  const authorName = blog?.author?.displayName || blog?.author?.username || 'Inkora Author';
  const authorAvatar = blog?.author?.profileImageUrl;
  const publishedDate = blog?.publishedAt 
    ? new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Draft';

  return (
    <article className="min-h-screen bg-white text-slate-900 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto">
        
        {/* Style Tag */}
        <div className="mb-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            MINIMAL ESSAY
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 leading-tight mb-4">
          {blog?.title || 'Untitled Story'}
        </h1>

        {/* Excerpt */}
        {blog?.excerpt && (
          <p className="text-lg text-slate-500 font-normal leading-relaxed mb-6">
            {blog.excerpt}
          </p>
        )}

        {/* Metadata */}
        <div className="flex items-center space-x-3 text-sm text-slate-400 pb-8 mb-10 border-b border-slate-100">
          {authorAvatar && (
            <img src={authorAvatar} alt={authorName} className="w-8 h-8 rounded-full object-cover" />
          )}
          <span className="text-slate-800 font-medium">{authorName}</span>
          <span>·</span>
          <span>{publishedDate}</span>
          <span>·</span>
          <span>{blog?.readingTimeMinutes || 3} min read</span>
        </div>

        {/* Cover Image */}
        {blog?.coverImageUrl && (
          <div className="mb-10">
            <img 
              src={blog.coverImageUrl} 
              alt={blog?.title} 
              className="w-full h-auto max-h-[420px] object-cover rounded-xl"
            />
          </div>
        )}

        {/* Content */}
        <div 
          className="prose prose-slate prose-lg max-w-none text-slate-700 leading-loose prose-headings:font-semibold prose-headings:text-slate-900 prose-headings:tracking-tight prose-p:my-5 prose-blockquote:border-l-2 prose-blockquote:border-slate-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-500 prose-code:text-slate-800 prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-100"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Tags */}
        {blog?.tags && blog.tags.length > 0 && (
          <div className="mt-16 pt-6 border-t border-slate-100">
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span 
                  key={tag.id || tag.name || tag}
                  className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 bg-slate-50 rounded-md transition"
                >
                  #{tag.name || tag}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </article>
  );
}
