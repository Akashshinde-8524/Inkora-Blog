import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { socialService } from '../services/socialService';
import BlogCard from '../components/blog/BlogCard';
import {
  Bookmark,
  Sparkles,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Compass,
  ArrowRight
} from 'lucide-react';

export default function Bookmarks() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchBookmarks = useCallback(async (pageNum = page) => {
    setLoading(true);
    try {
      const data = await socialService.getUserBookmarks(pageNum, 9);
      setBlogs(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load bookmarks:', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-600/10 rounded-3xl p-6 sm:p-10 border border-amber-500/20 shadow-sm mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
              <Bookmark className="w-7 h-7 fill-current" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-900 text-xs font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Personal Reading List</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Saved Stories & Bookmarks
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Catch up on thoughtful essays and guides you've saved for later
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500 block">
              {totalElements} {totalElements === 1 ? 'saved story' : 'saved stories'}
            </span>
          </div>
        </div>
      </div>

      {/* Bookmarked Blogs Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Retrieving saved stories...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-100">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Saved Stories Yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
            When you explore articles and discover content you love, click the save button in the reader dock to bookmark them here.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition text-decoration-none"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Stories in Explore</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center space-x-3">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          <span className="text-xs font-semibold text-slate-500">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
