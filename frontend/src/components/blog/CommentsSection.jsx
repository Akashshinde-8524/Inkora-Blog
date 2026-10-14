import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { commentService } from '../../services/commentService';
import {
  MessageSquare,
  Send,
  Trash2,
  Loader2,
  AlertCircle,
  LogIn,
  CornerDownRight
} from 'lucide-react';

export default function CommentsSection({ blogId, blogAuthorUsername, onCommentCountChange }) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadComments = useCallback(async () => {
    if (!blogId) return;
    try {
      setLoading(true);
      const data = await commentService.getBlogComments(blogId);
      setComments(data || []);
      if (onCommentCountChange) {
        onCommentCountChange(data ? data.length : 0);
      }
    } catch (err) {
      console.error('Failed to load comments:', err);
      setError('Unable to load discussion comments.');
    } finally {
      setLoading(false);
    }
  }, [blogId, onCommentCountChange]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const created = await commentService.addComment(blogId, trimmed);
      setComments((prev) => [created, ...prev]);
      setCommentText('');
      if (onCommentCountChange) {
        onCommentCountChange(comments.length + 1);
      }
    } catch (err) {
      console.error('Failed to post comment:', err);
      setError(err.message || 'Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    setDeletingId(commentId);
    try {
      await commentService.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      if (onCommentCountChange) {
        onCommentCountChange(Math.max(0, comments.length - 1));
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert(err.message || 'Failed to delete comment.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <section id="comments-section" className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-16">
      <div className="border-t border-slate-200/80 pt-10">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Discussion & Responses
              </h2>
              <p className="text-xs text-slate-500">
                Share your thoughts and connect with readers
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
            {comments.length} {comments.length === 1 ? 'response' : 'responses'}
          </span>
        </div>

        {/* Comment Form or Guest Login Banner */}
        {isAuthenticated ? (
          <form onSubmit={handleSubmit} className="mb-10 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/10 transition">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={user.displayName || user.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>{(user?.displayName || user?.username || 'U').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <span className="text-xs font-semibold text-slate-700">
                Responding as <strong className="text-slate-900">{user?.displayName || user?.username}</strong>
              </span>
            </div>

            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="What are your thoughts on this story? Leave a constructive comment..."
              className="w-full text-sm text-slate-800 placeholder-slate-400 border-0 focus:outline-none focus:ring-0 resize-none p-1"
              maxLength={1000}
            />

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
              <span className="text-[11px] text-slate-400 font-medium">
                {commentText.length}/1000 characters
              </span>

              <button
                type="submit"
                disabled={!commentText.trim() || submitting}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Response</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-10 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border border-blue-100 rounded-3xl p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white text-blue-600 shadow-sm flex items-center justify-center mx-auto mb-3">
              <LogIn className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Join the conversation
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto mb-4">
              Sign in to share your thoughts, exchange perspectives with the author, and engage with the community.
            </p>
            <div className="inline-flex items-center space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition text-decoration-none"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-sm transition text-decoration-none"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Comments List */}
        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-500">Loading discussion...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="py-12 text-center bg-slate-50/60 rounded-3xl border border-slate-100">
            <CornerDownRight className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600 mb-1">No responses yet</p>
            <p className="text-[11px] text-slate-400">
              Be the first to share your perspectives on this story.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => {
              const isCommentAuthor = user && comment.author && user.id === comment.author.id;
              const isStoryOwner = user && user.username === blogAuthorUsername;
              const canDelete = isCommentAuthor || isStoryOwner;

              return (
                <div
                  key={comment.id}
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:border-slate-200 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 mb-2">
                      <Link
                        to={`/@${comment.author?.username}`}
                        className="w-8 h-8 rounded-full bg-slate-100 shrink-0 overflow-hidden flex items-center justify-center font-bold text-xs text-slate-700 border border-slate-200 text-decoration-none"
                      >
                        {comment.author?.profileImageUrl ? (
                          <img
                            src={comment.author.profileImageUrl}
                            alt={comment.author.displayName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>
                            {(comment.author?.displayName || comment.author?.username || 'U')
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        )}
                      </Link>

                      <div>
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/@${comment.author?.username}`}
                            className="text-xs font-bold text-slate-900 hover:text-blue-600 transition text-decoration-none"
                          >
                            {comment.author?.displayName || comment.author?.username}
                          </Link>
                          {comment.author?.username === blogAuthorUsername && (
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                              Author
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 block">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Delete Action (Comment Author or Story Owner) */}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        disabled={deletingId === comment.id}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition"
                        title="Delete response"
                      >
                        {deletingId === comment.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap pl-11">
                    {comment.content}
                  </p>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
