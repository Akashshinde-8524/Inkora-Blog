import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { blogService } from '../services/blogService';
import ProfileEditModal from '../components/dashboard/ProfileEditModal';
import DeleteConfirmModal from '../components/dashboard/DeleteConfirmModal';
import {
  PenSquare,
  BookOpen,
  TrendingUp,
  Heart,
  MessageSquare,
  Sparkles,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Send,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Layers
} from 'lucide-react';

export default function Dashboard() {
  const { user, updateUser } = useAuth();

  // State
  const [stats, setStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
  });
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'PUBLISHED' | 'DRAFT'
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    blogId: null,
    blogTitle: '',
  });
  const [deleting, setDeleting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Fetch Dashboard Stats
  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const data = await blogService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch Author Blogs
  const loadBlogs = useCallback(async (tab = activeTab, pageNum = page) => {
    try {
      setLoading(true);
      const statusParam = tab === 'ALL' ? null : tab;
      const data = await blogService.getAuthorBlogs({
        status: statusParam,
        page: pageNum,
        size: 8,
      });
      setBlogs(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load author blogs:', err);
      showToast('Failed to load stories. Please refresh.', 'error');
    } finally {
      setLoading(false);
    }
  }, [activeTab, page]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadBlogs(activeTab, page);
  }, [activeTab, page, loadBlogs]);

  // Tab change handler
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(0);
  };

  // Publish / Unpublish handler
  const handleTogglePublish = async (blog) => {
    try {
      setActionLoadingId(blog.id);
      if (blog.status === 'PUBLISHED') {
        await blogService.unpublishBlog(blog.id);
        showToast(`"${blog.title}" moved to drafts.`);
      } else {
        await blogService.publishBlog(blog.id);
        showToast(`"${blog.title}" is now published and live!`);
      }
      await loadStats();
      await loadBlogs(activeTab, page);
    } catch (err) {
      console.error('Failed to update story status:', err);
      showToast(err.response?.data?.message || 'Failed to update status.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete modal open
  const openDeleteModal = (blog) => {
    setDeleteModalState({
      isOpen: true,
      blogId: blog.id,
      blogTitle: blog.title,
    });
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteModalState.blogId) return;

    try {
      setDeleting(true);
      await blogService.deleteBlog(deleteModalState.blogId);
      showToast('Story permanently deleted.');
      setDeleteModalState({ isOpen: false, blogId: null, blogTitle: '' });
      await loadStats();
      await loadBlogs(activeTab, page);
    } catch (err) {
      console.error('Failed to delete blog:', err);
      showToast(err.response?.data?.message || 'Failed to delete story.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Profile update handler
  const handleProfileUpdated = (updatedUser) => {
    updateUser(updatedUser);
    showToast('Profile updated successfully!');
  };

  const getStyleBadge = (style) => {
    switch (style) {
      case 'EDITORIAL':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-serif font-medium bg-amber-50 text-amber-800 border border-amber-200">
            Editorial
          </span>
        );
      case 'MINIMAL':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-100 text-slate-800 border border-slate-200">
            Minimal
          </span>
        );
      case 'NEO_BRUTALIST':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wide bg-yellow-300 text-black border-2 border-black shadow-[2px_2px_0px_#000]">
            Neo-Brutalist
          </span>
        );
      case 'MAGAZINE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            Magazine
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700">
            {style}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-20 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold transition-all animate-in slide-in-from-top-2 duration-200 ${
          toastMessage.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-800 shadow-rose-500/10'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-emerald-500/10'
        }`}>
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          )}
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* Author Profile Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-start sm:items-center space-x-4 sm:space-x-5">
            {/* Avatar */}
            <div className="relative group shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-700 border-2 border-white/20 shadow-md flex items-center justify-center">
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={user.displayName || user.username}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-black text-2xl sm:text-3xl">
                    {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2 border border-blue-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Author Workspace</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {user?.displayName || user?.username}
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
                @{user?.username} <span className="text-slate-500">•</span> {user?.email}
              </p>
              {user?.bio && (
                <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed italic line-clamp-2">
                  "{user.bio}"
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/dashboard/bookmarks"
              className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition backdrop-blur-sm border border-white/10 text-decoration-none"
            >
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>Saved Bookmarks</span>
            </Link>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition backdrop-blur-sm border border-white/10"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
            <Link
              to="/editor"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition text-decoration-none"
            >
              <PenSquare className="w-4 h-4" />
              <span>Write Story</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        
        {/* Total Stories */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Stories</span>
            <BookOpen className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">
            {statsLoading ? '...' : stats.totalBlogs}
          </p>
          <span className="text-xs text-slate-500 font-medium">
            {statsLoading ? 'Loading metrics...' : `${stats.publishedBlogs} published • ${stats.draftBlogs} drafts`}
          </span>
        </div>

        {/* Story Views */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Story Views</span>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">
            {statsLoading ? '...' : stats.totalViews.toLocaleString()}
          </p>
          <span className="text-xs text-slate-500 font-medium">
            Deduplicated views across all stories
          </span>
        </div>

        {/* Likes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Likes Received</span>
            <Heart className="w-5 h-5 text-rose-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">
            {statsLoading ? '...' : stats.totalLikes}
          </p>
          <span className="text-xs text-slate-500 font-medium">
            From community readers
          </span>
        </div>

        {/* Comments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Comments</span>
            <MessageSquare className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">
            {statsLoading ? '...' : stats.totalComments}
          </p>
          <span className="text-xs text-slate-500 font-medium">
            Reader feedback & thoughts
          </span>
        </div>
      </div>

      {/* Story Management Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-10">
        
        {/* Filter Tabs Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Manage Your Stories</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit, publish, unpublish, and review your articles across 4 visual styles.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => handleTabChange('ALL')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'ALL'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({stats.totalBlogs})
            </button>
            <button
              onClick={() => handleTabChange('PUBLISHED')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'PUBLISHED'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Published ({stats.publishedBlogs})
            </button>
            <button
              onClick={() => handleTabChange('DRAFT')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'DRAFT'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Drafts ({stats.draftBlogs})
            </button>
          </div>
        </div>

        {/* Stories Content */}
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">Loading your stories...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Layers className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No {activeTab === 'ALL' ? 'stories' : activeTab === 'PUBLISHED' ? 'published stories' : 'drafts'} found
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
              {activeTab === 'DRAFT'
                ? "You don't have any drafts in progress. Click 'Create Story' to start writing a new piece!"
                : "You haven't written any stories yet in this section. Start crafting your next piece now!"}
            </p>
            <Link
              to="/editor"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition text-decoration-none"
            >
              <PenSquare className="w-4 h-4" />
              <span>Create New Story</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="p-5 sm:p-6 hover:bg-slate-50/70 transition flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Story Info */}
                <div className="flex items-start space-x-4 flex-1 min-w-0">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                    {blog.coverImageUrl ? (
                      <img
                        src={blog.coverImageUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                        <BookOpen className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Title & Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {/* Status Badge */}
                      {blog.status === 'PUBLISHED' ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          <span>Draft</span>
                        </span>
                      )}

                      {/* Style Badge */}
                      {getStyleBadge(blog.style)}

                      {/* Tags */}
                      {blog.tags && blog.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag.id || tag.name}
                          className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 hover:text-blue-600 transition truncate">
                      <Link
                        to={blog.status === 'PUBLISHED' ? `/blog/${blog.slug}` : `/editor/${blog.id}`}
                        className="text-decoration-none text-slate-900 hover:text-blue-600"
                      >
                        {blog.title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    {blog.excerpt && (
                      <p className="text-xs sm:text-sm text-slate-500 line-clamp-1 mt-0.5 max-w-2xl">
                        {blog.excerpt}
                      </p>
                    )}

                    {/* Meta info */}
                    <div className="flex items-center space-x-4 text-xs text-slate-400 mt-2 flex-wrap gap-y-1">
                      <span className="inline-flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(blog.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </span>

                      {blog.readingTimeMinutes > 0 && (
                        <span className="inline-flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{blog.readingTimeMinutes} min read</span>
                        </span>
                      )}

                      <span className="inline-flex items-center space-x-1">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>{blog.viewCount || 0} views</span>
                      </span>

                      {blog.likesCount > 0 && (
                        <span className="inline-flex items-center space-x-1 text-rose-500 font-medium">
                          <Heart className="w-3.5 h-3.5 fill-current" />
                          <span>{blog.likesCount}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex items-center space-x-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 justify-end">
                  
                  {/* View Story (if published) */}
                  {blog.status === 'PUBLISHED' && (
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                      title="View Public Story"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  )}

                  {/* Edit Story */}
                  <Link
                    to={`/editor/${blog.id}`}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition text-decoration-none"
                    title="Edit Story"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>

                  {/* Publish / Unpublish Toggle */}
                  <button
                    onClick={() => handleTogglePublish(blog)}
                    disabled={actionLoadingId === blog.id}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                      blog.status === 'PUBLISHED'
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}
                    title={blog.status === 'PUBLISHED' ? 'Unpublish Story to Drafts' : 'Publish Story Live'}
                  >
                    {actionLoadingId === blog.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : blog.status === 'PUBLISHED' ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>{blog.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}</span>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => openDeleteModal(blog)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Delete Story"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Showing page <span className="font-bold text-slate-800">{page + 1}</span> of{' '}
              <span className="font-bold text-slate-800">{totalPages}</span> ({totalElements} stories)
            </span>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onProfileUpdated={handleProfileUpdated}
      />

      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, blogId: null, blogTitle: '' })}
        onConfirm={handleConfirmDelete}
        blogTitle={deleteModalState.blogTitle}
        deleting={deleting}
      />
    </div>
  );
}
