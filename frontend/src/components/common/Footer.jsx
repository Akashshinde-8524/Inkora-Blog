import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 text-decoration-none">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-900 font-bold text-base">
                I
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Inkora<span className="text-blue-500">.</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The modern blog builder and social publishing platform. Craft stories with dynamic themes, discover diverse creators, and build your audience.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Styles</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-white transition-colors cursor-pointer">Editorial</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Minimal</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Neo-Brutalist</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Magazine</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/explore" className="text-slate-400 hover:text-white transition-colors text-decoration-none">Explore Feed</Link></li>
              <li><Link to="/editor" className="text-slate-400 hover:text-white transition-colors text-decoration-none">Write Blog</Link></li>
              <li><Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors text-decoration-none">Dashboard</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Inkora Platform. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Built with Spring Boot 3 & React</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
