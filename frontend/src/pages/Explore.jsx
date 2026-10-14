
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { blogService } from '../services/blogService';
import { socialService } from '../services/socialService';
import { tagService } from '../services/tagService';
import { useAuth } from '../context/AuthContext';
import BlogCard from '../components/blog/BlogCard';
import {
  Search,
  Flame,
  Clock,
  Sparkles,
  Users,
  Tag as TagIcon,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export default function Explore() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialTag = searchParams.get('tag') || '';

  // State
  const [activeTab, setActiveTab] = useState('trending'); // 'trending' | 'latest' | 'popular' | 'following'
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedTag, setSelectedTag] = useState(initialTag);
  const [tags, setTags] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Load available tags
  useEffect(() => {
    tagService.getAllTags()
      .then((data) => setTags(data || []))
      .catch((err) => console.error('Failed to load tags:', err));
  }, []);

  // Update query / tag state if URL parameters change
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== searchQuery) {
      setSearchQuery(q);
      setPage(0);
    }
    const t = searchParams.get('tag');
    if (t !== null && t !== selectedTag) {
      setSelectedTag(t);
      setPage(0);
    }
  }, [searchParams, searchQuery, selectedTag]);

  // Fetch blogs based on tab, tag, query, page
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (searchQuery.trim()) {
        data = await blogService.searchBlogs(searchQuery.trim(), { page, size: 9 });
      } else if (activeTab === 'following') {
        data = await socialService.getFollowingFeed(page, 9);
      } else {
        data = await blogService.getExploreBlogs({
          tab: activeTab,
          tag: selectedTag || null,
          page,
          size: 9,
        });
      }
      setBlogs(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to fetch explore blogs:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedTag, searchQuery, page]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchParams(selectedTag ? { tag: selectedTag } : {});
    setPage(0);
  };

  const handleTagClick = (tagSlug) => {
    setPage(0);
    if (selectedTag === tagSlug) {
      setSelectedTag('');
      setSearchParams(searchQuery ? { q: searchQuery } : {});
    } else {
      setSelectedTag(tagSlug);
      setSearchParams(searchQuery ? { q: searchQuery, tag: tagSlug } : { tag: tagSlug });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-3 border border-blue-200/50">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Social Discovery Feed</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Explore Stories & Ideas
        </h1>
        <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
          Discover hand-crafted articles across Editorial, Minimal, Neo-Brutalist, and Magazine designs.
        </p>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative mt-6 max-w-xl mx-auto">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, or keywords..."
              className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-4 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tag Chips Carousel */}
      {tags.length > 0 && (
        <div className="mb-8 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center space-x-2 justify-start sm:justify-center flex-nowrap sm:flex-wrap">
            <button
              onClick={() => handleTagClick('')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                !selectedTag
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
            >
              All Topics
            </button>
            {tags.map((t) => {
              const isSelected = selectedTag === t.slug;
              return (
                <button
                  key={t.id}
                  onClick={() => handleTagClick(t.slug)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 flex items-center space-x-1 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                >
                  <TagIcon className="w-3 h-3 opacity-60" />
                  <span>#{t.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabs Row (hidden if actively searching) */}
      {!searchQuery.trim() && (
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-8 flex-wrap gap-4">
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => {
                setActiveTab('trending');
                setPage(0);
              }}
              className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'trending'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Trending</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('latest');
                setPage(0);
              }}
              className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'latest'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>Latest</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('popular');
                setPage(0);
              }}
              className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'popular'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>Popular</span>
            </button>
            {user && (
              <button
                onClick={() => {
                  setActiveTab('following');
                  setSelectedTag('');
                  setPage(0);
                }}
                className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'following'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <Users className="w-3.5 h-3.5 text-emerald-500" />
                <span>Following</span>
              </button>
            )}
          </div>

          <span className="text-xs font-semibold text-slate-500">
            {totalElements} {totalElements === 1 ? 'story' : 'stories'} discovered
          </span>
        </div>
      )}

      {/* Stories Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Discovering stories...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Stories Found</h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
            {searchQuery
              ? `No stories matched your search "${searchQuery}". Try different keywords or reset your filters.`
              : activeTab === 'following'
                ? 'You are not following any authors yet, or the creators you follow have not published stories. Explore creators and click follow to personalize your feed!'
                : selectedTag
                  ? `No stories tagged #${selectedTag} yet. Be the first to publish one!`
                  : 'No stories available in this feed right now.'}
          </p>
          {(searchQuery || selectedTag) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTag('');
                setSearchParams({});
                setPage(0);
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
            >
              Reset Filters
            </button>
          )}
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
