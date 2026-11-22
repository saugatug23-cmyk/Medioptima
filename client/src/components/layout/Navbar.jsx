import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Menu, X, Hexagon, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, currentUser, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const renderNavLinks = () => {
    if (!isAuthenticated) {
      return (
        <>
          <a href="#how-it-works" className="hover:text-[var(--color-primary)] transition-colors">How it works</a>
          <a href="#features" className="hover:text-[var(--color-primary)] transition-colors">Features</a>
          <a href="#about" className="hover:text-[var(--color-primary)] transition-colors">About</a>
          <a href="#faq" className="hover:text-[var(--color-primary)] transition-colors">FAQs</a>
          <a href="#contact" className="hover:text-[var(--color-primary)] transition-colors">Contact</a>
        </>
      );
    }
    
    if (currentUser?.role === 'ADMIN') {
      return (
        <>
          <Link to="/admin/dashboard" className="hover:text-[var(--color-primary)] transition-colors">Dashboard</Link>
          <Link to="/admin/pharmacies" className="hover:text-[var(--color-primary)] transition-colors">Pharmacies</Link>
          <Link to="/admin/medicines" className="hover:text-[var(--color-primary)] transition-colors">Medicines</Link>
          <Link to="/admin/inventory" className="hover:text-[var(--color-primary)] transition-colors">Inventory</Link>
          <Link to="/admin/users" className="hover:text-[var(--color-primary)] transition-colors">Users</Link>
        </>
      );
    }

    return (
      <>
        <Link to="/dashboard" className="hover:text-[var(--color-primary)] transition-colors">Dashboard</Link>
        <Link to="/search" className="hover:text-[var(--color-primary)] transition-colors">Find Medicines</Link>
        <Link to="/profile" className="hover:text-[var(--color-primary)] transition-colors">My Profile</Link>
      </>
    );
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent',
        isScrolled ? 'bg-white/90 backdrop-blur-md border-[var(--color-border-subtle)] shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center group">
          <img 
            src="/logo.png" 
            alt="MediOptima Logo" 
            className="h-16 w-auto object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105" 
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-text-secondary)]">
          {renderNavLinks()}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                Sign in
              </Link>
              <Button asChild>
                <Link to="/register">Get started</Link>
              </Button>
            </>
          ) : (
            <Button variant="secondary" onClick={logout} className="gap-2">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          )}
        </div>

        <button 
          className="md:hidden p-2 -mr-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-[var(--color-border-subtle)] shadow-elevated py-4 px-6 flex flex-col gap-4 animate-fade-in">
          {!isAuthenticated ? (
            <>
              <a href="#how-it-works" className="py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>How it works</a>
              <a href="#features" className="py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#about" className="py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>About</a>
              <a href="#faq" className="py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>FAQs</a>
              <a href="#contact" className="py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>Contact</a>
              <div className="h-px bg-[var(--color-border-subtle)] my-2" />
              <Link to="/login" className="py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
              <Button asChild className="w-full mt-2" onClick={() => setMobileMenuOpen(false)}>
                <Link to="/register">Get started</Link>
              </Button>
            </>
          ) : (
            <>
              {currentUser?.role === 'ADMIN' ? (
                <>
                  <Link to="/admin/dashboard" className="py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                  <Link to="/admin/pharmacies" className="py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>Pharmacies</Link>
                  <Link to="/admin/medicines" className="py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>Medicines</Link>
                  <Link to="/admin/inventory" className="py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>Inventory</Link>
                  <Link to="/admin/users" className="py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>Users</Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                  <Link to="/search" className="py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>Find Medicines</Link>
                  <Link to="/profile" className="py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>My Profile</Link>
                </>
              )}
              <div className="h-px bg-[var(--color-border-subtle)] my-2" />
              <Button variant="secondary" onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full">
                Logout
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
