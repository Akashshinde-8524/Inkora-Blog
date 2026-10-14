import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { socialService } from '../services/socialService';
import { useAuth } from '../context/AuthContext';
import BlogCard from '../components/blog/BlogCard';
import {
  BookOpen,
  Sparkles,
  Loader2,
  AlertCircle,
  Edit3,
  UserPlus,
  UserCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function AuthorProfile() {
  const { username: rawUsername } = useParams();
  const username = (rawUsername || '').replace(/^@/, '');
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Optimistic follow state
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  const isOwnProfile = currentUser && currentUser.username === username;

  // Load Author Profile
  const loadProfile = useCallback(async () => {
    try {
      const data = await userService.getUserProfile(username);
      setProfile(data);
      setIsFollowing(Boolean(data.isFollowing));
      setFollowersCount(data.followersCount || 0);
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError(err.response?.data?.message || 'Author profile not found.');
    }
  }, [username]);

  // Load Author's Published Blogs
  const loadBlogs = useCallback(async (pageNum = page) => {
    try {
      const data = await userService.getUserBlogs(username, { page: pageNum, size: 9 });
      setBlogs(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load author blogs:', err);
    }
  }, [username, page]);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setError(null);
    Promise.all([loadProfile(), loadBlogs()])
      .finally(() => setLoading(false));
  }, [username, loadProfile, loadBlogs]);

  const handleToggleFollow = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const prevFollowing = isFollowing;
    const prevCount = followersCount;
    setIsFollowing(!prevFollowing);
    setFollowersCount(prevFollowing ? Math.max(0, prevCount - 1) : prevCount + 1);

    try {
      const res = await socialService.toggleFollow(username);
      setIsFollowing(res.following);
      setFollowersCount(res.followersCount);
    } catch (err) {
      console.error('Failed to toggle follow:', err);
      setIsFollowing(prevFollowing);
      setFollowersCount(prevCount);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-600">Loading author profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Author Not Found</h1>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          {error || `The user @${username} does not exist on Inkora.`}
        </p>
        <Link
          to="/explore"
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition text-decoration-none"
        >
          <span>Explore Platform</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Author Showcase Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-12 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-start sm:items-center space-x-5">
            {/* Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden bg-slate-700 border-2 border-white/20 shadow-md shrink-0 flex items-center justify-center font-black text-3xl">
              {profile.profileImageUrl ? (
                <img
                  src={profile.profileImageUrl}
                  alt={profile.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{(profile.displayName || profile.username || 'U').charAt(0).toUpperCase()}</span>
              )}
            </div>

            {/* Profile Info */}
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2 border border-blue-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Creator</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {profile.displayName || profile.username}
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
                @{profile.username}
              </p>
              {profile.bio && (
                <p className="text-slate-300 text-xs sm:text-sm mt-3 max-w-2xl leading-relaxed italic">
                  "{profile.bio}"
                </p>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            {isOwnProfile ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition backdrop-blur-sm border border-white/10 text-decoration-none"
              >
                <Edit3 className="w-4 h-4" />
                <span>Manage Workspace</span>
              </Link>
            ) : (
              <button
                onClick={handleToggleFollow}
                className={`inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition ${
                  isFollowing
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 max-w-lg gap-4 text-center sm:text-left">
          <div>
            <span className="block text-xl sm:text-2xl font-black text-white">
              {profile.blogsCount || totalElements}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Published Stories
            </span>
          </div>

          <div>
            <span className="block text-xl sm:text-2xl font-black text-white">
              {followersCount}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Followers
            </span>
          </div>

          <div>
            <span className="block text-xl sm:text-2xl font-black text-white">
              {profile.followingCount || 0}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Following
            </span>
          </div>
        </div>
      </div>

      {/* Stories Showcase Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Stories by {profile.displayName || profile.username}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Published essays, guides, and thoughts crafted on Inkora
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          {totalElements} {totalElements === 1 ? 'story' : 'stories'}
        </span>
      </div>

      {/* Stories Grid */}
      {blogs.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">No Published Stories Yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            @{profile.username} hasn't published any stories yet. Check back soon!
          </p>
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
