import React from 'react';
import { Calendar, Clock, Sparkles } from 'lucide-react';

export default function MagazineTheme({ blog, contentHtml }) {
  const authorName = blog?.author?.displayName || blog?.author?.username || 'Staff Writer';
  const authorAvatar = blog?.author?.profileImageUrl;
  const publishedDate = blog?.publishedAt 
    ? new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Draft Preview';

  return (
    <article className="min-h-screen bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Magazine Masthead */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-8">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
              Featured Edition
            </span>
            <span className="text-xs text-slate-400">Exclusive Story</span>
          </div>
          <span className="text-xs font-mono text-slate-500">INKORA MAGAZINE</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6">
          {blog?.title || 'Untitled Feature'}
        </h1>

        {/* Excerpt Lead */}
        {blog?.excerpt && (
          <p className="text-lg sm:text-2xl text-slate-300 font-light leading-relaxed mb-8 border-l-4 border-rose-500 pl-4">
            {blog.excerpt}
          </p>
        )}

        {/* Author Card Container */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 mb-10 shadow-lg">
          <div className="flex items-center space-x-3">
            {authorAvatar ? (
              <img src={authorAvatar} alt={authorName} className="w-11 h-11 rounded-full object-cover ring-2 ring-rose-500/40" />
            ) : (
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center font-bold text-base text-white shadow">
                {authorName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-white leading-tight">{authorName}</p>
              <p className="text-xs text-slate-400 mt-0.5">Author & Creator</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-rose-400" />
              <span>{publishedDate}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>{blog?.readingTimeMinutes || 3} min read</span>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {blog?.coverImageUrl && (
          <div className="relative mb-12 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            <img 
              src={blog.coverImageUrl} 
              alt={blog?.title} 
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        )}

        {/* Content Body */}
        <div 
          className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed prose-headings:font-extrabold prose-headings:text-white prose-p:my-5 prose-blockquote:border-l-4 prose-blockquote:border-rose-500 prose-blockquote:pl-5 prose-blockquote:text-slate-200 prose-blockquote:italic prose-code:text-rose-400 prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Tags */}
        {blog?.tags && blog.tags.length > 0 && (
          <div className="mt-16 pt-6 border-t border-slate-800 flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span 
                key={tag.id || tag.name || tag}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-semibold rounded-full border border-slate-700 transition"
              >
                #{tag.name || tag}
              </span>
            ))}
          </div>
        )}

      </div>
    </article>
  );
}
