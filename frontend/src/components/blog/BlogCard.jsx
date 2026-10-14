import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Eye, Heart, BookOpen } from 'lucide-react';

export default function BlogCard({ blog }) {
  if (!blog) return null;

  const author = blog.author || {};
  const authorName = author.displayName || author.username || 'Anonymous';
  const authorUsername = author.username || '';
  const authorAvatar = author.profileImageUrl;

  const publishedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date(blog.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

  const getStyleBadge = (style) => {
    switch (style) {
      case 'EDITORIAL':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-serif font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            Editorial
          </span>
        );
      case 'MINIMAL':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-slate-100 text-slate-800 border border-slate-300">
            Minimal
          </span>
        );
      case 'NEO_BRUTALIST':
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-yellow-300 text-black border-2 border-black shadow-[2px_2px_0px_#000]">
            Neo-Brutalist
          </span>
        );
      case 'MAGAZINE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-sans font-bold bg-purple-100 text-purple-900 border border-purple-300">
            Magazine
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] bg-slate-100 text-slate-700">
            {style}
          </span>
        );
    }
  };

  return (
    <article className="group bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Cover Image Container */}
      <Link to={`/blog/${blog.slug}`} className="block relative aspect-[16/9] overflow-hidden bg-slate-100">
        {blog.coverImageUrl ? (
          <img
            src={blog.coverImageUrl}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50 text-slate-400 group-hover:text-blue-500 transition-colors">
            <BookOpen className="w-10 h-10 mb-1 opacity-60" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Inkora Story</span>
          </div>
        )}

        {/* Style Badge Floating */}
        <div className="absolute top-3 right-3 drop-shadow-sm">
          {getStyleBadge(blog.style)}
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {blog.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id || tag.name}
                  className="text-[11px] font-medium text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-md"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-2">
            <Link to={`/blog/${blog.slug}`} className="text-decoration-none text-slate-900 group-hover:text-blue-600">
              {blog.title}
            </Link>
          </h3>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
              {blog.excerpt}
            </p>
          )}
        </div>

        {/* Author & Footer Metadata */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-auto">
          {/* Author */}
          <Link
            to={authorUsername ? `/@${authorUsername}` : '#'}
            className="flex items-center space-x-2.5 min-w-0 text-decoration-none group/author"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-200 shrink-0 flex items-center justify-center font-bold text-xs text-slate-700">
              {authorAvatar ? (
                <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
              ) : (
                <span>{authorName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 group-hover/author:text-blue-600 truncate transition-colors">
                {authorName}
              </p>
              {authorUsername && (
                <p className="text-[11px] text-slate-400 truncate">@{authorUsername}</p>
              )}
            </div>
          </Link>

          {/* Metrics */}
          <div className="flex items-center space-x-3 text-[11px] text-slate-400 shrink-0">
            <span className="flex items-center space-x-1" title={`${blog.readingTimeMinutes || 2} min read`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{blog.readingTimeMinutes || 2}m</span>
            </span>

            <span className="flex items-center space-x-1" title={`${blog.viewCount || 0} views`}>
              <Eye className="w-3.5 h-3.5" />
              <span>{blog.viewCount || 0}</span>
            </span>

            {blog.likesCount > 0 && (
              <span className="flex items-center space-x-1 text-rose-500 font-semibold" title={`${blog.likesCount} likes`}>
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>{blog.likesCount}</span>
              </span>
            )}
          </div>
        </div>

      </div>
    </article>
  );
}
