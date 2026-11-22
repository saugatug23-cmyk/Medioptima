import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border-subtle)] bg-white py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center mb-6">
            <img 
              src="/logo.png" 
              alt="MediOptima Logo" 
              className="h-16 w-auto object-contain mix-blend-multiply" 
            />
          </Link>
          <p className="text-sm text-gray-500 max-w-sm">
            Intelligent medicine procurement and route planning for when you need it most.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-sm mb-4">Product</h4>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><a href="#how-it-works" className="hover:text-[var(--color-navy)] transition-colors">How it works</a></li>
            <li><a href="#features" className="hover:text-[var(--color-navy)] transition-colors">Features</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium text-sm mb-4">Company</h4>
          <ul className="space-y-3 text-sm text-gray-500 mb-8">
            <li><a href="#about" className="hover:text-[var(--color-navy)] transition-colors">About</a></li>
          </ul>
          
          <h4 className="font-medium text-sm mb-4">Legal</h4>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><Link to="#" className="hover:text-[var(--color-navy)] transition-colors">Privacy</Link></li>
            <li><Link to="#" className="hover:text-[var(--color-navy)] transition-colors">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} MediOptima. All rights reserved.</p>
      </div>
    </footer>
  );
}
