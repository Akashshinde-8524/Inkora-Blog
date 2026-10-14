import React from 'react';
import { Calendar, Clock, User, Tag } from 'lucide-react';

export default function EditorialTheme({ blog, contentHtml }) {
  const authorName = blog?.author?.displayName || blog?.author?.username || 'Inkora Author';
  const authorAvatar = blog?.author?.profileImageUrl;
  const publishedDate = blog?.publishedAt 
    ? new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Unpublished Draft';

  return (
    <article className="min-h-screen bg-[#faf8f5] text-[#2c2c2c] py-12 px-4 sm:px-6 lg:px-8 font-serif">
      <div className="max-w-3xl mx-auto">
        
        {/* Editorial Sub-header Badge */}
        <div className="text-center mb-6">
          <span className="font-sans text-xs uppercase tracking-[0.25em] text-[#7d7065] font-bold border-b border-[#d8d0c5] pb-1">
            The Inkora Literary Review
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#1a1a1a] tracking-tight leading-[1.15] text-center mb-6 font-serif">
          {blog?.title || 'Untitled Story'}
        </h1>

        {/* Subtitle / Excerpt */}
        {blog?.excerpt && (
          <p className="text-lg sm:text-xl text-[#5a524a] italic text-center font-serif leading-relaxed mb-8 max-w-2xl mx-auto">
            {blog.excerpt}
          </p>
        )}

        {/* Author & Publication Metadata */}
        <div className="flex flex-wrap items-center justify-center gap-4 py-4 border-y border-[#e2dcd2] text-xs font-sans text-[#7d7065] mb-10">
          <div className="flex items-center space-x-2">
            {authorAvatar ? (
              <img src={authorAvatar} alt={authorName} className="w-7 h-7 rounded-full object-cover grayscale" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#3d3834] text-white flex items-center justify-center font-bold text-xs">
                {authorName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="font-semibold text-[#1a1a1a] uppercase tracking-wider">{authorName}</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{publishedDate}</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{blog?.readingTimeMinutes || 3} min read</span>
          </div>
        </div>

        {/* Cover Image */}
        {blog?.coverImageUrl && (
          <div className="mb-12">
            <img 
              src={blog.coverImageUrl} 
              alt={blog?.title} 
              className="w-full h-auto max-h-[480px] object-cover rounded-sm shadow-sm border border-[#e2dcd2]"
            />
          </div>
        )}

        {/* Semantic Content Body */}
        <div 
          className="prose prose-lg sm:prose-xl max-w-none text-[#2d2926] leading-relaxed font-serif prose-headings:font-serif prose-headings:font-bold prose-headings:text-[#1a1a1a] prose-p:my-5 prose-blockquote:border-l-4 prose-blockquote:border-[#1a1a1a] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-[#423d38] prose-code:font-mono prose-code:bg-[#ede7df] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#252220] prose-pre:text-[#f2eee9] prose-img:rounded-sm"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Tags Section */}
        {blog?.tags && blog.tags.length > 0 && (
          <div className="mt-14 pt-6 border-t border-[#e2dcd2] font-sans">
            <p className="text-xs uppercase tracking-widest text-[#7d7065] font-bold mb-3">Topic Classifications</p>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span 
                  key={tag.id || tag.name || tag}
                  className="px-3 py-1 bg-[#ede7df] text-[#3d3834] text-xs font-semibold uppercase tracking-wider rounded-sm"
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
