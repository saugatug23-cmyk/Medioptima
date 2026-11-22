import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, ArrowRight, Inbox, Map } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';

export function Dashboard() {
  const { currentUser } = useAuth();
  
  // Real data doesn't exist yet for plans/locations in this stage, so we use empty states.
  const recentPlans = []; 
  const savedLocations = [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="mb-2">
        <h1 className="text-2xl font-medium tracking-tight mb-2">
          Welcome back{currentUser?.name ? `, ${currentUser.name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-[var(--color-text-secondary)]">What medicines do you need to find today?</p>
      </div>

      <Card className="border-[var(--color-primary)] ring-1 ring-[var(--color-primary)] ring-opacity-10 shadow-elevated bg-[var(--color-soft-green)] relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-white/40 to-transparent pointer-events-none"></div>
        <CardContent className="p-8 md:p-10 relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-xl font-medium mb-4 text-[var(--color-primary-dark)]">Find your medicines</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-[var(--color-primary)]" />
                <Input 
                  placeholder="E.g., Paracetamol, Cetirizine..." 
                  className="pl-10 h-11 border-white/50 bg-white shadow-sm text-base focus:ring-[var(--color-primary)]"
                  readOnly
                  onClick={() => document.getElementById('search-btn').click()}
                />
              </div>
              <Button asChild size="lg" id="search-btn" className="h-11 px-8">
                <Link to="/search">Search Network</Link>
              </Button>
            </div>
            <p className="text-sm text-[var(--color-primary)] opacity-80 mt-4 font-medium">
              Enter multiple medicines to find the optimal combination of pharmacies.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">Recent Plans</h3>
          <div className="space-y-3">
            {recentPlans.length > 0 ? (
              // Would map real plans here
              null
            ) : (
              <div className="border border-dashed border-[var(--color-border-subtle)] rounded-xl p-8 flex flex-col items-center justify-center text-center bg-white/50">
                <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                  <Inbox className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">No recent plans</p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-[200px]">
                  Your optimized pharmacy routes will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">Saved Locations</h3>
          <div className="space-y-3">
            {savedLocations.length > 0 ? (
              // Would map real locations here
              null
            ) : (
              <div className="border border-dashed border-[var(--color-border-subtle)] rounded-xl p-8 flex flex-col items-center justify-center text-center bg-white/50">
                <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                  <Map className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">No saved locations</p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-[200px]">
                  Add locations in your profile for quicker searching.
                </p>
                <Button variant="ghost" size="sm" asChild className="mt-3 text-[var(--color-primary)]">
                  <Link to="/profile">Go to Profile</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
