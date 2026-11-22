import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Search, MapPin, Clock, Plus, Activity, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PatientDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, Alex</h1>
          <p className="text-slate-500">Here's your medicine procurement overview.</p>
        </div>
        <Link to="/search">
          <Button className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" /> New Search
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Prescriptions</p>
              <h4 className="text-2xl font-bold text-slate-900">3</h4>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-success/10 rounded-lg text-success">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Procured this month</p>
              <h4 className="text-2xl font-bold text-slate-900">12</h4>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-warning/10 rounded-lg text-warning">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Time saved (est.)</p>
              <h4 className="text-2xl font-bold text-slate-900">4.5h</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Search */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Find Medicines</CardTitle>
            <CardDescription>Search for medicines to build your procurement plan.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Enter medicine name (e.g., Amoxicillin)" className="pl-10" />
              </div>
              <Button>Add</Button>
            </div>
            
            <div className="mt-8">
              <h4 className="text-sm font-medium text-slate-900 mb-4">Recent Searches</h4>
              <div className="space-y-3">
                {[
                  { name: 'Metformin 500mg', status: 'Found nearby', date: '2 days ago' },
                  { name: 'Lisinopril 10mg', status: 'Found nearby', date: '1 week ago' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <Search className="h-4 w-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.date}</p>
                      </div>
                    </div>
                    <Badge variant="success">{item.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nearby Pharmacies */}
        <Card>
          <CardHeader>
            <CardTitle>Nearby Pharmacies</CardTitle>
            <CardDescription>Available pharmacies in your area.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'City Health Pharmacy', distance: '0.8 km', status: 'Open' },
                { name: 'MediCare Plus', distance: '1.2 km', status: 'Open' },
                { name: 'Downtown Drugs', distance: '2.5 km', status: 'Closed soon' },
              ].map((pharmacy, i) => (
                <div key={i} className="flex items-start justify-between">
                  <div>
                    <h5 className="text-sm font-medium text-slate-900">{pharmacy.name}</h5>
                    <div className="flex items-center text-xs text-slate-500 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {pharmacy.distance}
                    </div>
                  </div>
                  <Badge variant={pharmacy.status === 'Open' ? 'success' : 'warning'} className="text-[10px]">
                    {pharmacy.status}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <Button variant="outline" className="w-full text-sm">View Map</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
