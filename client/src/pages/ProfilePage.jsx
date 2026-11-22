import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { User, Mail, Phone, MapPin } from 'lucide-react';

export function ProfilePage() {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500">Manage your personal information.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your account details and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-900">{currentUser.name}</h3>
              <Badge variant={currentUser.role === 'ADMIN' ? 'primary' : 'default'} className="mt-1">
                {currentUser.role}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
            <div>
              <label className="text-sm font-medium text-slate-500 flex items-center">
                <Mail className="h-4 w-4 mr-2" /> Email
              </label>
              <p className="mt-1 text-slate-900">{currentUser.email}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-500 flex items-center">
                <Phone className="h-4 w-4 mr-2" /> Phone
              </label>
              <p className="mt-1 text-slate-900">{currentUser.phone || 'Not provided'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-500 flex items-center">
                <MapPin className="h-4 w-4 mr-2" /> Location
              </label>
              <p className="mt-1 text-slate-900">
                {currentUser.location?.address ? currentUser.location.address : 'Location not set'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
