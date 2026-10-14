import React, { useState, useEffect } from 'react';
import { X, Upload, User, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { userService } from '../../services/userService';
import { uploadService } from '../../services/uploadService';

export default function ProfileEditModal({ isOpen, onClose, user, onProfileUpdated }) {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [imageLoadError, setImageLoadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && isOpen) {
      setDisplayName(user.displayName || '');
      setBio(user.bio || '');
      setProfileImageUrl(user.profileImageUrl || '');
      setImageLoadError(false);
      setError('');
    }
  }, [user, isOpen]);

  useEffect(() => {
    setImageLoadError(false);
  }, [profileImageUrl]);

  if (!isOpen) return null;

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP, GIF).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image file must be less than 5MB.');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const data = await uploadService.uploadImage(file, 'profiles');
      const uploadedUrl = data?.url;

      if (uploadedUrl) {
        setProfileImageUrl(uploadedUrl);
      } else {
        setError('Server completed upload but no image URL was returned.');
      }
    } catch (err) {
      console.error('Failed to upload avatar:', err);
      setError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setError('Display name cannot be empty.');
      return;
    }

    setError('');
    setSaving(true);

    try {
      const updated = await userService.updateProfile({
        displayName: displayName.trim(),
        bio: bio.trim(),
        profileImageUrl: profileImageUrl.trim() || null,
      });

      if (onProfileUpdated) {
        onProfileUpdated(updated);
      }
      onClose();
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.response?.data?.message || 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <h2 id="edit-profile-title" className="text-lg font-bold text-slate-900">
              Edit Author Profile
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start space-x-2.5">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Avatar Section */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Profile Photo
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative group w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner flex items-center justify-center shrink-0">
                {profileImageUrl && !imageLoadError ? (
                  <img
                    src={profileImageUrl}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                    onError={() => setImageLoadError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-xl">
                    {displayName ? displayName.charAt(0).toUpperCase() : user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center text-white">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? 'Uploading...' : profileImageUrl?.startsWith('/uploads/') ? 'Change Photo' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  {profileImageUrl && (
                    <button
                      type="button"
                      onClick={() => setProfileImageUrl('')}
                      className="text-xs text-rose-500 hover:text-rose-700 font-semibold px-2 py-1"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {profileImageUrl?.startsWith('/uploads/') ? (
                  <div className="flex items-center justify-between px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs">
                    <span className="font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Photo uploaded from device
                    </span>
                    <button
                      type="button"
                      onClick={() => setProfileImageUrl('')}
                      className="text-[11px] text-slate-500 hover:text-slate-800 underline"
                    >
                      Paste URL instead
                    </button>
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="Or paste direct image URL (https://...)"
                    value={profileImageUrl}
                    onChange={(e) => setProfileImageUrl(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Display Name *
            </label>
            <input
              type="text"
              required
              maxLength={100}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
            />
          </div>

          {/* Bio */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Author Bio
              </label>
              <span className="text-[11px] text-slate-400">
                {bio.length}/1000 characters
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={1000}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Share a short bio with your readers..."
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex items-center space-x-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md transition disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
