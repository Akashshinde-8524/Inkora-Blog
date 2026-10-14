import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  PenTool, 
  Layers, 
  Share2, 
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  Heart,
  Bookmark
} from 'lucide-react';

export default function Home() {
  const [selectedStyle, setSelectedStyle] = useState('EDITORIAL');

  const demoStyles = [
    { id: 'EDITORIAL', label: '1. Editorial', desc: 'Serif literary elegance & newspaper typography' },
    { id: 'MINIMAL', label: '2. Minimal', desc: 'Pure simplicity, generous whitespace & distraction-free' },
    { id: 'NEO_BRUTALIST', label: '3. Neo-Brutalist', desc: 'Bold borders, high-contrast & hard shadows' },
    { id: 'MAGAZINE', label: '4. Magazine', desc: 'Card-based hierarchy & rich visual storytelling' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-6 animate-fade-in shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Blog Builder + Social Publishing</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              Write Once. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                Publish in Any Aesthetic.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Inkora decouples your writing from its visual presentation. Choose between Editorial, Minimal, Neo-Brutalist, and Magazine styles with a single click.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/editor"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-bold text-base transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-decoration-none"
              >
                <PenTool className="w-5 h-5" />
                <span>Start Writing Free</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link
                to="/explore"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-6 py-3.5 rounded-xl font-semibold text-base transition-all text-decoration-none"
              >
                <span>Explore Feed</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Style Demonstrator */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
              Separation of Content vs. Presentation
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Try switching the style below. The underlying story stays identical while the visual experience transforms dynamically:
            </p>
          </div>

          {/* Style Selector Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-8">
            {demoStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`p-3.5 rounded-xl text-left transition-all border ${
                  selectedStyle === style.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-blue-500/30'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <p className="font-bold text-sm mb-0.5">{style.label}</p>
                <p className={`text-xs ${selectedStyle === style.id ? 'text-slate-300' : 'text-slate-500'}`}>
                  {style.desc}
                </p>
              </button>
            ))}
          </div>

          {/* Dynamic Style Preview Container */}
          <div className="rounded-2xl transition-all duration-300">
            {selectedStyle === 'EDITORIAL' && (
              <article className="p-8 sm:p-12 bg-[#faf8f5] text-[#2c2c2c] rounded-2xl border border-[#e5dfd5] font-serif shadow-sm">
                <span className="text-xs uppercase tracking-widest text-[#7d7065] font-sans font-bold">
                  Editorial Style • Architectural Design
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-bold mt-3 mb-4 text-[#1a1a1a] leading-tight">
                  The Metamorphosis of Modern Digital Publishing
                </h3>
                <div className="flex items-center space-x-3 text-xs text-[#7d7065] font-sans border-b border-[#e5dfd5] pb-4 mb-6">
                  <span>By Eleanor Vance</span>
                  <span>•</span>
                  <span>October 5, 2026</span>
                  <span>•</span>
                  <span>4 min read</span>
                </div>
                <p className="text-lg leading-relaxed text-[#3a3a3a] mb-4">
                  For centuries, the printed page was bounded by rigid physical dimensions. In the age of reactive interfaces, typography reclaims its rightful place: not merely as decoration, but as the primary conduit of narrative empathy.
                </p>
                <blockquote className="border-l-4 border-slate-800 pl-4 my-6 italic text-slate-700 text-xl">
                  “Design is the silent ambassador of your story.”
                </blockquote>
              </article>
            )}

            {selectedStyle === 'MINIMAL' && (
              <article className="p-8 sm:p-12 bg-white text-slate-900 rounded-2xl border border-slate-100 font-sans shadow-soft">
                <span className="text-xs font-semibold text-slate-400 tracking-wider">
                  MINIMAL
                </span>
                <h3 className="text-2xl sm:text-3xl font-medium tracking-tight mt-2 mb-3 text-slate-900">
                  The Metamorphosis of Modern Digital Publishing
                </h3>
                <div className="flex items-center space-x-3 text-xs text-slate-400 mb-6">
                  <span>Eleanor Vance</span>
                  <span>·</span>
                  <span>4 min read</span>
                </div>
                <p className="text-base text-slate-600 leading-loose max-w-2xl">
                  For centuries, the printed page was bounded by rigid physical dimensions. In the age of reactive interfaces, typography reclaims its rightful place: not merely as decoration, but as the primary conduit of narrative empathy.
                </p>
              </article>
            )}

            {selectedStyle === 'NEO_BRUTALIST' && (
              <article className="p-8 sm:p-12 bg-white rounded-xl border-4 border-black shadow-[6px_6px_0px_#000000] font-sans">
                <span className="inline-block px-2.5 py-1 text-xs font-black uppercase bg-[#ffe600] border-2 border-black mb-3">
                  NEO-BRUTALIST MODE
                </span>
                <h3 className="text-2xl sm:text-4xl font-black text-black uppercase tracking-tight mb-4">
                  The Metamorphosis of Modern Digital Publishing
                </h3>
                <div className="flex items-center space-x-2 text-xs font-bold text-black border-2 border-black bg-[#00f0ff] p-2 inline-flex mb-6">
                  <span>AUTHOR: ELEANOR VANCE</span>
                  <span>|</span>
                  <span>4 MIN READ</span>
                </div>
                <p className="text-base font-medium text-black leading-relaxed border-2 border-black p-4 bg-[#f4f4f0]">
                  For centuries, the printed page was bounded by rigid physical dimensions. In the age of reactive interfaces, typography reclaims its rightful place: not merely as decoration, but as the primary conduit of narrative empathy.
                </p>
              </article>
            )}

            {selectedStyle === 'MAGAZINE' && (
              <article className="p-8 sm:p-12 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden relative">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                    Feature Story
                  </span>
                  <span className="text-xs text-slate-400">4 min read</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
                  The Metamorphosis of Modern Digital Publishing
                </h3>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs text-white">
                    EV
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Eleanor Vance</p>
                    <p className="text-xs text-slate-400">Staff Writer • Architecture & Design</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300 leading-relaxed border-t border-slate-800 pt-6">
                  <p>
                    For centuries, the printed page was bounded by rigid physical dimensions. In the age of reactive interfaces, typography reclaims its rightful place: not merely as decoration, but as the primary conduit of narrative empathy.
                  </p>
                  <p className="hidden md:block">
                    By decoupling semantic markdown from visual layouts, writers focus entirely on substance while readers experience tailored, high-fidelity storytelling.
                  </p>
                </div>
              </article>
            )}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
              Crafted for Modern Writers & Avid Readers
            </h2>
            <p className="text-slate-600">
              Everything you need to write, publish, distribute, and monetize your influence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">4 Visual Themes</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Editorial, Minimal, Neo-Brutalist, and Magazine. Switch styles anytime without altering your article's markdown.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Social Discovery</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Explore trending stories, follow your favorite authors, leave comments, and bookmark articles for later reading.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-5">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Distraction-Free Editor</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Clean markdown editor with live image uploads, tag autocompletion, real-time preview, and auto-draft saving.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
