import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogService } from '../services/blogService';
import { socialService } from '../services/socialService';
import { useAuth } from '../context/AuthContext';
import BlogRenderer from '../components/blog/BlogRenderer';
import CommentsSection from '../components/blog/CommentsSection';
import {
  ArrowLeft,
  Heart,
  Bookmark,
  Share2,
  Check,
  Edit3,
  Loader2,
  AlertCircle,
  Eye,
  Calendar,
  Clock,
  MessageSquare
} from 'lucide-react';

export default function BlogDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Social interactions
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const [copied, setCopied] = useState(false);

  // Fetch blog data
  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    blogService.getBlogBySlug(slug)
      .then((data) => {
        setBlog(data);
        setLiked(Boolean(data.likedByCurrentUser));
        setLikesCount(data.likesCount || 0);
        setBookmarked(Boolean(data.bookmarkedByCurrentUser));
      })
      .catch((err) => {
        console.error('Failed to load blog:', err);
        setError(err.response?.data?.message || 'Story not found or unavailable.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  // Scroll Progress Tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const scroll = `${(totalScroll / windowHeight) * 100}%`;
        setScrollProgress(scroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLikeToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!prevLiked);
    setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);

    try {
      const res = await socialService.toggleLike(blog.id);
      setLiked(res.active);
      setLikesCount(res.count);
    } catch (err) {
      console.error('Failed to toggle like:', err);
      setLiked(prevLiked);
      setLikesCount(prevCount);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const prevBookmarked = bookmarked;
    setBookmarked(!prevBookmarked);

    try {
      const res = await socialService.toggleBookmark(blog.id);
      setBookmarked(res.active);
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
      setBookmarked(prevBookmarked);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-600">Loading story...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Story Unavailable</h1>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          {error || "The story you're looking for doesn't exist or is currently a private draft."}
        </p>
        <Link
          to="/explore"
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition text-decoration-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Other Stories</span>
        </Link>
      </div>
    );
  }

  const isAuthor = user && blog.author && user.id === blog.author.id;

  return (
    <div className="relative min-h-screen">
      {/* Top Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 z-50 transition-all duration-75"
        style={{ width: scrollProgress }}
      />

      {/* Top Floating Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-6 py-3 transition">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            to="/explore"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition text-decoration-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Explore</span>
          </Link>

          <div className="flex items-center space-x-3">
            {/* Style Badge */}
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              Theme: {blog.style}
            </span>

            {/* Author Edit Button */}
            {isAuthor && (
              <Link
                to={`/editor/${blog.id}`}
                className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition text-decoration-none"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Story</span>
              </Link>
            )}

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="inline-flex items-center space-x-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
              title="Share this story"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Blog Article Rendered Dynamically via Selected Style */}
      <main>
        <BlogRenderer blog={blog} />
      </main>

      {/* Bottom Floating Interaction Bar */}
      <aside aria-label="Story actions" className="sticky bottom-6 z-40 max-w-md mx-auto px-4">
        <div className="bg-slate-900/90 text-white backdrop-blur-lg rounded-2xl shadow-2xl p-2.5 flex items-center justify-around border border-white/10">
          {/* Like */}
          <button
            onClick={handleLikeToggle}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              liked ? 'text-rose-400 bg-rose-500/20' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            <span>{likesCount}</span>
          </button>

          {/* Bookmark */}
          <button
            onClick={handleBookmarkToggle}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              bookmarked ? 'text-amber-400 bg-amber-500/20' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            <span>{bookmarked ? 'Saved' : 'Save'}</span>
          </button>

          {/* Comments Jump */}
          <button
            onClick={() => {
              const el = document.getElementById('comments-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition"
            title="Jump to discussion"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{commentsCount}</span>
          </button>

          {/* Views */}
          <div className="flex items-center space-x-1 px-3 py-1.5 text-xs text-slate-400">
            <Eye className="w-4 h-4" />
            <span>{blog.viewCount || 0}</span>
          </div>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition"
            title="Copy link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Discussion & Comments Section */}
      <CommentsSection
        blogId={blog.id}
        blogAuthorUsername={blog.author?.username}
        onCommentCountChange={setCommentsCount}
      />

      {/* Author Footer Card */}
      <footer className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
          {/* Avatar */}
          <Link to={blog.author?.username ? `/@${blog.author.username}` : '#'}>
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-inner flex items-center justify-center font-black text-2xl text-slate-700">
              {blog.author?.profileImageUrl ? (
                <img
                  src={blog.author.profileImageUrl}
                  alt={blog.author.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{(blog.author?.displayName || 'U').charAt(0).toUpperCase()}</span>
              )}
            </div>
          </Link>

          {/* Details */}
          <div className="flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Written By
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              <Link
                to={blog.author?.username ? `/@${blog.author.username}` : '#'}
                className="text-decoration-none text-slate-900 hover:text-blue-600 transition"
              >
                {blog.author?.displayName || blog.author?.username}
              </Link>
            </h3>
            <p className="text-xs text-slate-400 mb-3">@{blog.author?.username}</p>
            {blog.author?.bio && (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic mb-4">
                "{blog.author.bio}"
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <Link
                to={blog.author?.username ? `/@${blog.author.username}` : '#'}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 text-decoration-none"
              >
                <span>View Author Profile & Stories</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
