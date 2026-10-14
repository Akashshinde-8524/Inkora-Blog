import React, { useState } from 'react';
import { X, Plus, Hash } from 'lucide-react';

const SUGGESTED_TAGS = [
  'Technology', 'React', 'Java', 'Spring Boot', 'Design', 'Architecture', 'UI/UX', 'Career', 'Tutorial'
];

export default function TagInput({ tags, setTags }) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    }
  };

  const addTag = (tagName) => {
    const clean = tagName.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setInput('');
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="mb-6">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
        Tags & Topics (Press Enter or comma to add)
      </label>

      {/* Active Tags Chips */}
      <div className="flex flex-wrap items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl min-h-[46px]">
        {tags.map((tag, idx) => (
          <span 
            key={idx}
            className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 animate-fade-in"
          >
            <Hash className="w-3 h-3 text-blue-500" />
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="text-blue-400 hover:text-blue-700 focus:outline-none"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (input.trim()) addTag(input); }}
          placeholder={tags.length === 0 ? "Add tags like 'React', 'Design'..." : "Add another tag..."}
          className="flex-grow bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none min-w-[140px] px-1"
        />
      </div>

      {/* Suggested Tags */}
      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
        <span className="font-medium mr-1">Suggestions:</span>
        {SUGGESTED_TAGS.filter(t => !tags.includes(t)).slice(0, 6).map((suggested) => (
          <button
            key={suggested}
            type="button"
            onClick={() => addTag(suggested)}
            className="px-2 py-0.5 bg-white border border-slate-200 text-slate-600 rounded-md hover:border-blue-400 hover:text-blue-600 transition"
          >
            +{suggested}
          </button>
        ))}
      </div>
    </div>
  );
}
