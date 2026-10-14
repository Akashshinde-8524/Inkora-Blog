import React from 'react';
import { BookOpen, Sparkles, Zap, Newspaper } from 'lucide-react';

const STYLES = [
  {
    id: 'EDITORIAL',
    name: '1. Editorial',
    desc: 'Literary serif, newspaper layout, generous line-height',
    icon: BookOpen,
    accent: 'border-amber-700 bg-amber-50 text-amber-900',
    font: 'font-serif'
  },
  {
    id: 'MINIMAL',
    name: '2. Minimal',
    desc: 'Ample whitespace, distraction-free, pure simplicity',
    icon: Sparkles,
    accent: 'border-slate-800 bg-slate-50 text-slate-800',
    font: 'font-sans'
  },
  {
    id: 'NEO_BRUTALIST',
    name: '3. Neo-Brutalist',
    desc: 'Bold black strokes, hard shadows, playful retro pop',
    icon: Zap,
    accent: 'border-black bg-[#ffe600] text-black shadow-[3px_3px_0px_#000000]',
    font: 'font-sans font-bold'
  },
  {
    id: 'MAGAZINE',
    name: '4. Magazine',
    desc: 'Visual cards, bold badges, multi-column hierarchy',
    icon: Newspaper,
    accent: 'border-slate-900 bg-slate-900 text-white',
    font: 'font-sans'
  }
];

export default function StylePicker({ selectedStyle, setSelectedStyle }) {
  return (
    <div className="mb-8">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
        Choose Visual Presentation Theme (Can be changed anytime)
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {STYLES.map((style) => {
          const Icon = style.icon;
          const isSelected = selectedStyle === style.id;

          return (
            <button
              key={style.id}
              type="button"
              onClick={() => setSelectedStyle(style.id)}
              className={`p-4 rounded-2xl text-left transition-all border-2 flex flex-col justify-between ${
                isSelected 
                  ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20' 
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-lg ${style.accent}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  )}
                </div>
                <h4 className={`text-sm font-bold text-slate-900 mb-1 ${style.font}`}>
                  {style.name}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {style.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
