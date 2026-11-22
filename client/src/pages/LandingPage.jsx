import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Search, MapPin, Zap, TrendingUp, ArrowRight, ShieldCheck, Clock, CheckCircle2, Store } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-slate-50 -z-10" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10" />
        
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-white border border-slate-200 rounded-full px-3 py-1 mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary-light"></span>
            <span className="text-sm font-medium text-slate-600">Introducing MediOptima</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
            Find the right medicines. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">Choose smarter.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            MediOptima helps you locate required medicines across nearby pharmacies and creates an optimized procurement plan using advanced machine learning.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/dashboard">
              <Button size="lg" className="w-full sm:w-auto group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                How It Works
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Trust/Value Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose MediOptima?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">We use intelligent algorithms to save you time, money, and hassle when procuring healthcare essentials.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <Store className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Smart Pharmacy Selection</h3>
              <p className="text-slate-600 text-sm">Automatically identify the best combination of pharmacies to fulfill your complete prescription.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Intelligent Predictions</h3>
              <p className="text-slate-600 text-sm">Machine learning forecasts availability and pricing to help you make informed decisions.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Route Optimization</h3>
              <p className="text-slate-600 text-sm">Get the most efficient travel route between selected pharmacies to save time.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Real-time Availability</h3>
              <p className="text-slate-600 text-sm">Check stock levels across multiple locations instantly without making a single phone call.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
              <p className="text-slate-600">A seamless process from prescription to procurement.</p>
            </div>
            
            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  1
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <Search className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Enter Medicines</h3>
                  </div>
                  <p className="text-slate-600 text-sm">Input your prescription details or upload a list of required medicines into our secure platform.</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  2
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                   <div className="flex items-center space-x-3 mb-3">
                    <Zap className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Analyze Availability</h3>
                  </div>
                  <p className="text-slate-600 text-sm">Our ML engine checks inventory across partner pharmacies in your vicinity.</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  3
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                   <div className="flex items-center space-x-3 mb-3">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Optimize Selection</h3>
                  </div>
                  <p className="text-slate-600 text-sm">We calculate the best combination of pharmacies based on distance, price, and availability.</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  4
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                   <div className="flex items-center space-x-3 mb-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Follow the Route</h3>
                  </div>
                  <p className="text-slate-600 text-sm">Get turn-by-turn navigation to collect all your medicines efficiently.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-slate-900 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-primary-light rounded-full opacity-20 blur-3xl"></div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">Ready to simplify your medicine procurement?</h2>
            <p className="text-slate-300 mb-10 text-lg relative z-10">Join thousands of patients who are already saving time and money with MediOptima.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 relative z-10">
              <Link to="/dashboard">
                <Button size="lg" className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100">
                  Start Your Search
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
