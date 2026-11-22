import React from 'react';
import { User, Mail, Shield, MapPin, Phone, BadgeCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export function Profile() {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight mb-2">Profile & Settings</h1>
        <p className="text-[var(--color-text-secondary)] text-sm">Manage your account preferences and saved locations.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-[var(--color-primary)]" />
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-[var(--color-text-primary)] block mb-1.5">Full Name</label>
              <div className="bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-2.5 text-sm shadow-sm font-medium">
                {currentUser?.name}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--color-text-primary)] block mb-1.5">Email Address</label>
              <div className="bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-2.5 text-sm flex items-center gap-2 shadow-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                {currentUser?.email}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--color-text-primary)] block mb-1.5">Phone Number</label>
              <div className="bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-2.5 text-sm flex items-center gap-2 shadow-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                {currentUser?.phone || 'Not provided'}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--color-text-primary)] block mb-1.5">Role</label>
              <div className="bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-2.5 text-sm flex items-center gap-2 shadow-sm">
                <BadgeCheck className="h-4 w-4 text-[var(--color-primary)]" />
                <span className="capitalize">{currentUser?.role?.toLowerCase()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[var(--color-primary)]" />
            Saved Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-[var(--color-border-subtle)] rounded-xl bg-white shadow-sm hover:border-[var(--color-border-hover)] transition-colors">
              <div>
                <p className="font-medium text-sm text-[var(--color-text-primary)]">Home</p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">123 Market St, San Francisco</p>
              </div>
              <Button variant="ghost" size="sm" className="text-[var(--color-danger)]">Remove</Button>
            </div>
            <div className="flex items-center justify-between p-4 border border-[var(--color-border-subtle)] rounded-xl bg-white shadow-sm hover:border-[var(--color-border-hover)] transition-colors">
              <div>
                <p className="font-medium text-sm text-[var(--color-text-primary)]">Work</p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">456 Corporate Blvd, Suite 200</p>
              </div>
              <Button variant="ghost" size="sm" className="text-[var(--color-danger)]">Remove</Button>
            </div>
          </div>
          <Button variant="secondary" className="mt-5 w-full md:w-auto">Add New Location</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-[var(--color-primary)]" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed">
            MediOptima only uses your location data during active searches to calculate distance and routes. We do not store your search history on our servers for longer than 30 days unless explicitly saved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="secondary">Change Password</Button>
            <Button variant="ghost" className="text-[var(--color-danger)]">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
