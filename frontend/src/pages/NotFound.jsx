import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-black text-slate-900 mb-2">404</h1>
      <p className="text-xl text-slate-600 mb-6">Page Not Found</p>
      <Link to="/" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow hover:bg-blue-700 transition">
        Go Back Home
      </Link>
    </div>
  );
}
