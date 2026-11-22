import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Users, Store, Pill, Activity, ArrowUpRight } from 'lucide-react';

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
          <p className="text-slate-500">System performance and analytics.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Generate Report</Button>
          <Button>System Settings</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <Users className="h-5 w-5" />
              </div>
              <Badge variant="success" className="flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 12%
              </Badge>
            </div>
            <p className="text-sm font-medium text-slate-500">Total Users</p>
            <h4 className="text-3xl font-bold text-slate-900">8,432</h4>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <Store className="h-5 w-5" />
              </div>
              <Badge variant="success" className="flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 4%
              </Badge>
            </div>
            <p className="text-sm font-medium text-slate-500">Partner Pharmacies</p>
            <h4 className="text-3xl font-bold text-slate-900">142</h4>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <Pill className="h-5 w-5" />
              </div>
              <Badge variant="default" className="flex items-center text-slate-600">
                Stable
              </Badge>
            </div>
            <p className="text-sm font-medium text-slate-500">Medicines Tracked</p>
            <h4 className="text-3xl font-bold text-slate-900">12,045</h4>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <Activity className="h-5 w-5" />
              </div>
              <Badge variant="success" className="flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 24%
              </Badge>
            </div>
            <p className="text-sm font-medium text-slate-500">API Requests (24h)</p>
            <h4 className="text-3xl font-bold text-slate-900">142.5k</h4>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent System Activity</CardTitle>
            <CardDescription>Latest events across the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { event: 'New Pharmacy Onboarded', target: 'CarePlus Rx', time: '10 mins ago', status: 'success' },
                { event: 'ML Model Update', target: 'Pricing Predictor v2', time: '1 hour ago', status: 'primary' },
                { event: 'High API Latency Detected', target: 'Route Engine', time: '3 hours ago', status: 'warning' },
                { event: 'Inventory Sync Completed', target: 'All partners', time: '5 hours ago', status: 'success' },
              ].map((activity, i) => (
                <div key={i} className="flex items-start justify-between p-3 border border-slate-100 rounded-lg">
                  <div>
                    <h5 className="text-sm font-medium text-slate-900">{activity.event}</h5>
                    <p className="text-xs text-slate-500">{activity.target}</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <Badge variant={activity.status} className="mb-1 text-[10px]">{activity.status}</Badge>
                    <span className="text-xs text-slate-400">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Status</CardTitle>
            <CardDescription>Current health of ML and Optimization engines.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span className="text-sm font-medium">Core API</span>
                </div>
                <span className="text-sm text-slate-500">Operational</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-warning"></div>
                  <span className="text-sm font-medium">Python ML Engine</span>
                </div>
                <span className="text-sm text-slate-500">Connecting (Pending Implementation)</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-warning"></div>
                  <span className="text-sm font-medium">C++ Optimization Engine</span>
                </div>
                <span className="text-sm text-slate-500">Connecting (Pending Implementation)</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span className="text-sm font-medium">Database (MongoDB)</span>
                </div>
                <span className="text-sm text-slate-500">Operational</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
