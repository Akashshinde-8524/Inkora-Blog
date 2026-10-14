import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import uploadService from '../../services/uploadService';

export default function CoverUploader({ coverImageUrl, setCoverImageUrl }) {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = await uploadService.uploadImage(file, 'blogs');
      setCoverImageUrl(data.url);
    } catch (err) {
      alert(err.message || 'Failed to upload cover image.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      setCoverImageUrl(urlInput.trim());
      setUrlInput('');
      setShowUrlInput(false);
    }
  };

  if (coverImageUrl) {
    return (
      <div className="relative mb-6 rounded-2xl overflow-hidden border border-slate-200 group max-h-[360px] bg-slate-100">
        <img 
          src={coverImageUrl} 
          alt="Blog Cover" 
          className="w-full h-full object-cover max-h-[360px]"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 bg-white/90 hover:bg-white text-slate-800 rounded-xl text-xs font-bold shadow transition"
          >
            Change Cover
          </button>
          <button
            type="button"
            onClick={() => setCoverImageUrl('')}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center space-x-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition disabled:opacity-50"
        >
          {uploading ? (
            <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Upload className="w-4 h-4 text-slate-500" />
          )}
          <span>{uploading ? 'Uploading...' : 'Add Cover Image'}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Paste Image URL</span>
        </button>
      </div>

      {showUrlInput && (
        <div className="mt-3 flex items-center space-x-2 animate-fade-in max-w-md">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-black transition"
          >
            Apply
          </button>
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/png,image/jpeg,image/webp,image/gif" 
        className="hidden" 
      />
    </div>
  );
}
