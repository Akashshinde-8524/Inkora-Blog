import React from 'react';
import { Calendar, Clock, User, Zap } from 'lucide-react';

export default function NeoBrutalistTheme({ blog, contentHtml }) {
  const authorName = blog?.author?.displayName || blog?.author?.username || 'ANONYMOUS';
  const publishedDate = blog?.publishedAt 
    ? new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
    : 'DRAFT_MODE';

  return (
    <article className="min-h-screen bg-[#fdfbf7] text-black py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Top Neo Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#ffe600] border-2 border-black font-black text-xs uppercase shadow-[3px_3px_0px_#000000]">
            <Zap className="w-3.5 h-3.5" />
            <span>NEO-BRUTALIST ARCHIVE</span>
          </div>
          <span className="font-mono text-xs font-bold border-2 border-black bg-white px-2 py-0.5 shadow-[2px_2px_0px_#000000]">
            SYS_REF: {blog?.slug || 'STORY'}
          </span>
        </div>

        {/* Title Container */}
        <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-[8px_8px_0px_#000000] mb-8">
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black leading-tight mb-4">
            {blog?.title || 'UNTITLED_ENTRY'}
          </h1>

          {blog?.excerpt && (
            <div className="bg-[#f0f0ea] border-2 border-black p-3 mb-4 text-sm sm:text-base font-bold text-black">
              {blog.excerpt}
            </div>
          )}

          {/* Meta Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t-2 border-black text-xs font-black uppercase">
            <span className="bg-[#00f0ff] px-2 py-1 border-2 border-black shadow-[2px_2px_0px_#000000]">
              CREATOR: {authorName}
            </span>
            <span className="bg-[#ff90e8] px-2 py-1 border-2 border-black shadow-[2px_2px_0px_#000000]">
              DATE: {publishedDate}
            </span>
            <span className="bg-[#a3e635] px-2 py-1 border-2 border-black shadow-[2px_2px_0px_#000000]">
              EST_READ: {blog?.readingTimeMinutes || 3} MIN
            </span>
          </div>
        </div>

        {/* Cover Image */}
        {blog?.coverImageUrl && (
          <div className="border-4 border-black bg-white p-2 shadow-[8px_8px_0px_#000000] mb-10">
            <img 
              src={blog.coverImageUrl} 
              alt={blog?.title} 
              className="w-full h-auto max-h-[440px] object-cover border-2 border-black"
            />
          </div>
        )}

        {/* Content Box */}
        <div className="border-4 border-black bg-white p-6 sm:p-10 shadow-[8px_8px_0px_#000000] mb-10">
          <div 
            className="prose prose-lg max-w-none text-black prose-headings:font-black prose-headings:uppercase prose-headings:text-black prose-p:my-5 prose-blockquote:border-l-8 prose-blockquote:border-black prose-blockquote:bg-[#ffe600]/30 prose-blockquote:p-4 prose-blockquote:font-bold prose-code:font-mono prose-code:bg-black prose-code:text-yellow-300 prose-code:p-1 prose-pre:bg-black prose-pre:text-green-400 prose-pre:border-2 prose-pre:border-black prose-img:border-2 prose-img:border-black"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>

        {/* Tags */}
        {blog?.tags && blog.tags.length > 0 && (
          <div className="border-4 border-black bg-[#ffe600] p-4 shadow-[6px_6px_0px_#000000] flex flex-wrap gap-2">
            <span className="font-black text-xs uppercase tracking-wider mr-2 self-center">TAGS:</span>
            {blog.tags.map((tag) => (
              <span 
                key={tag.id || tag.name || tag}
                className="px-2.5 py-1 bg-white text-black font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000000]"
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
