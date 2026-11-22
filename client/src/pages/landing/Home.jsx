import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  Target,
  Layers,
  TrendingDown,
  Navigation,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { formatCurrency } from '../../utils/currency';

const faqs = [
  {
    question: "What is MediOptima?",
    answer: "MediOptima helps you find medicines at nearby pharmacies, compare your options, and plan your pharmacy visits in one place."
  },
  {
    question: "How does MediOptima help me find medicines?",
    answer: "You enter the medicines you need, and MediOptima shows pharmacies where those medicines are available based on the information in the system."
  },
  {
    question: "Can I search for more than one medicine?",
    answer: "Yes. You can enter multiple medicines and see how different pharmacies can help you get them."
  },
  {
    question: "Does MediOptima show pharmacy availability?",
    answer: "Yes. The application shows the availability information stored in the system, including whether a medicine is available, running low, or unavailable."
  },
  {
    question: "Does MediOptima choose the pharmacy for me?",
    answer: "MediOptima helps you compare the available options and suggests a practical choice based on factors such as distance, price and availability. You remain in control of the final decision."
  },
  {
    question: "What if a medicine is not available?",
    answer: "MediOptima can show suitable alternative options where available. Medicine alternatives should always be confirmed with your doctor or pharmacist."
  },
  {
    question: "Can I see where the pharmacies are?",
    answer: "Yes. The application can show pharmacies on a map and help you understand the locations you may need to visit."
  },
  {
    question: "Is MediOptima a medical advice service?",
    answer: "No. MediOptima is designed to help with finding medicines and planning pharmacy visits. It does not replace a doctor, pharmacist or other qualified healthcare professional."
  },
  {
    question: "Is the pharmacy information real-time?",
    answer: "Currently, this platform uses simulated demonstration data for development purposes. Real-time availability requires direct integration with live pharmacy inventory systems."
  }
];

export function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle'); // idle, success

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network request since there's no backend for this yet
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus('idle'), 5000); // reset after 5s
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full pb-20 bg-[var(--color-bg-base)]">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 px-6 overflow-hidden">
        {/* Layer 1: Premium Background Wallpaper */}
        <div className="absolute inset-0 -z-20 overflow-hidden bg-[var(--color-bg-base)]">
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-[position:15%_center] sm:bg-[position:25%_center] md:bg-center animate-subtle-scale opacity-95"
            style={{ backgroundImage: 'url(/hero-bg.png)' }}
          ></div>
        </div>
        
        {/* Layer 2: Subtle Readability Overlay */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#F7FAF8]/80 via-[#F7FAF8]/30 to-transparent md:bg-gradient-to-r md:from-[#F7FAF8]/90 md:via-[#F7FAF8]/40 md:to-transparent pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-xl z-10 animate-slide-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-[var(--color-text-primary)] leading-[1.1] mb-6">
              Find your medicines.<br />
              <span className="text-[var(--color-primary)]">Choose the easier way.</span>
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)] mb-10 leading-relaxed max-w-lg">
              MediOptima helps you find the medicines you need at nearby pharmacies, compare your options, and plan your visits in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-12 px-8 text-base shadow-soft" asChild>
                <Link to="/dashboard">Find Medicines</Link>
              </Button>
              <Button size="lg" variant="secondary" className="h-12 px-8 text-base bg-white" asChild>
                <a href="#how-it-works">How It Works</a>
              </Button>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="relative z-10 lg:ml-auto w-full max-w-lg animate-fade-in">
            <Card className="border-[var(--color-primary)] ring-1 ring-[var(--color-primary)] ring-opacity-10 shadow-elevated bg-white/95 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[var(--color-primary)] text-white text-[10px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-bl-xl shadow-sm">
                Best Match
              </div>
              <CardContent className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-lg font-medium mb-1 text-[var(--color-primary-dark)]">Visit Plan</h2>
                    <p className="text-sm text-[var(--color-text-secondary)]">All medicines at one location.</p>
                  </div>
                </div>

                <div className="bg-[var(--color-bg-base)] rounded-xl p-5 border border-[var(--color-border-subtle)] mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-primary)]">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">MediCare Plus</p>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">2.8 km away</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pl-[52px] space-y-2">
                    <div className="flex items-center justify-between text-sm py-1 border-b border-gray-100">
                      <span className="font-medium">Medicine A</span>
                      <span className="text-[var(--color-emerald-accent)] text-xs flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Available</span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-1">
                      <span className="font-medium">Medicine B</span>
                      <span className="text-[var(--color-emerald-accent)] text-xs flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Available</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 text-sm text-[var(--color-text-secondary)] font-medium">
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> 12 min</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="py-24 bg-white border-y border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-soft-green)] text-[var(--color-primary-dark)] text-sm font-medium mb-6">
                <Target className="h-4 w-4" /> The Challenge
              </div>
              <h2 className="text-3xl font-medium mb-6 text-[var(--color-text-primary)]">Need several medicines?</h2>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                Finding everything at one pharmacy isn't always easy. One pharmacy may have some medicines, while another may have the rest.
              </p>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                MediOptima helps you compare nearby options and find a practical way to get what you need, rather than driving between multiple locations hoping to find stock.
              </p>
            </div>
            
            {/* Visual Problem Story */}
            <div className="bg-[var(--color-bg-base)] rounded-3xl p-8 border border-[var(--color-border-subtle)] relative shadow-inner">
              <div className="absolute top-4 right-6 text-[10px] font-bold tracking-widest uppercase text-gray-400">Inventory Distribution</div>
              
              <div className="mt-6 flex flex-col gap-6 relative">
                <div className="absolute left-6 top-8 bottom-8 w-px bg-[var(--color-border-subtle)] border-dashed border-l"></div>
                
                <div className="flex items-center gap-6 relative z-10 opacity-60">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[var(--color-border-subtle)] shadow-sm flex items-center justify-center shrink-0">
                    <span className="font-medium text-[var(--color-text-secondary)]">01</span>
                  </div>
                  <div className="flex-1 bg-white rounded-xl border border-[var(--color-border-subtle)] p-4 flex gap-2">
                    <div className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-500">Med A</div>
                    <div className="px-2 py-1 border border-dashed border-gray-200 rounded text-xs font-medium text-gray-300">Missing</div>
                  </div>
                </div>

                <div className="flex items-center gap-6 relative z-10 opacity-60">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[var(--color-border-subtle)] shadow-sm flex items-center justify-center shrink-0">
                    <span className="font-medium text-[var(--color-text-secondary)]">02</span>
                  </div>
                  <div className="flex-1 bg-white rounded-xl border border-[var(--color-border-subtle)] p-4 flex gap-2">
                    <div className="px-2 py-1 border border-dashed border-gray-200 rounded text-xs font-medium text-gray-300">Missing</div>
                    <div className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-500">Med B</div>
                    <div className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-500">Med C</div>
                  </div>
                </div>

                <div className="flex items-center gap-6 relative z-10 transform translate-x-2 transition-transform shadow-elevated">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)] text-white shadow-soft flex items-center justify-center shrink-0 ring-4 ring-white">
                    <span className="font-medium">03</span>
                  </div>
                  <div className="flex-1 bg-white rounded-xl border-2 border-[var(--color-primary)] p-4 flex gap-2 relative overflow-hidden">
                    <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[var(--color-soft-green)] to-transparent opacity-50"></div>
                    <div className="px-2 py-1 bg-[var(--color-soft-green)] text-[var(--color-primary-dark)] rounded text-xs font-medium">Med A</div>
                    <div className="px-2 py-1 bg-[var(--color-soft-green)] text-[var(--color-primary-dark)] rounded text-xs font-medium">Med B</div>
                    <div className="px-2 py-1 bg-[var(--color-soft-green)] text-[var(--color-primary-dark)] rounded text-xs font-medium">Med C</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 bg-[var(--color-bg-base)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-medium mb-4 text-[var(--color-text-primary)]">How It Works</h2>
            <p className="text-[var(--color-text-secondary)]">A clear sequence to help you find what you need.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            <div className="hidden md:block absolute top-8 left-10 right-10 h-px bg-[var(--color-border-subtle)] -z-10"></div>
            
            {[
              { num: "01", title: "Tell us what medicines you need", icon: Layers },
              { num: "02", title: "See nearby pharmacies", icon: Search },
              { num: "03", title: "Compare what's available", icon: TrendingDown },
              { num: "04", title: "Choose the option that works best for you", icon: Target },
              { num: "05", title: "See your visit plan", icon: Navigation }
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[var(--color-border-subtle)] shadow-sm text-center relative group hover:-translate-y-1 transition-transform">
                <div className="w-16 h-16 mx-auto bg-[var(--color-bg-base)] rounded-xl border border-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-primary)] mb-4 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Step {step.num}</div>
                <h3 className="font-medium text-sm leading-tight text-[var(--color-text-primary)]">{step.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 bg-white border-t border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-medium mb-4 text-[var(--color-text-primary)]">How MediOptima Helps</h2>
            <p className="text-[var(--color-text-secondary)]">Compare pharmacies and make informed choices easily.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Capability 1 */}
            <Card className="overflow-hidden group hover:shadow-elevated transition-shadow">
              <div className="h-48 bg-gray-50 border-b border-[var(--color-border-subtle)] relative overflow-hidden flex items-center justify-center p-8">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(var(--color-border-subtle) 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
                <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl shadow-soft p-4 w-full max-w-sm relative z-10 flex gap-4">
                  <div className="w-12 h-12 bg-teal-50 text-[var(--color-primary)] rounded-lg flex items-center justify-center">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="w-24 h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="w-32 h-2 bg-gray-100 rounded mb-1"></div>
                    <div className="w-20 h-2 bg-gray-100 rounded"></div>
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                <h3 className="text-lg font-medium mb-3">Find Nearby Pharmacies</h3>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                  See which nearby pharmacies have your medicines.
                </p>
              </CardContent>
            </Card>

            {/* Capability 2 */}
            <Card className="overflow-hidden group hover:shadow-elevated transition-shadow">
              <div className="h-48 bg-gray-50 border-b border-[var(--color-border-subtle)] relative flex items-center justify-center p-6">
                <div className="w-full max-w-xs space-y-3">
                  <div className="bg-white border-2 border-[var(--color-primary)] rounded-lg p-3 shadow-sm flex justify-between items-center">
                    <span className="text-sm font-medium">Medicine A</span>
                    <Badge variant="available">Available</Badge>
                  </div>
                  <div className="bg-white border border-[var(--color-border-subtle)] rounded-lg p-3 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Medicine B</span>
                    <Badge variant="warning">Running low</Badge>
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                <h3 className="text-lg font-medium mb-3">Check Availability</h3>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                  See whether a medicine is available, running low, or unavailable.
                </p>
              </CardContent>
            </Card>

            {/* Capability 3 */}
            <Card className="overflow-hidden group hover:shadow-elevated transition-shadow">
              <div className="h-48 bg-gray-50 border-b border-[var(--color-border-subtle)] relative flex items-center justify-center p-6">
                <div className="flex gap-4 w-full max-w-md">
                  <div className="flex-1 bg-white border border-[var(--color-border-subtle)] rounded-lg p-3 text-center shadow-sm">
                    <div className="text-xs text-gray-500 mb-1">Pharmacy A</div>
                    <div className="font-medium text-lg">{formatCurrency(14.50)}</div>
                    <div className="text-[10px] text-gray-400 mt-1">1.2 km away</div>
                  </div>
                  <div className="flex-1 bg-[var(--color-soft-green)] border-2 border-[var(--color-primary)] rounded-lg p-3 text-center shadow-sm relative">
                    <div className="absolute -top-2 -right-2 bg-[var(--color-primary)] text-white text-[8px] font-bold px-2 py-0.5 rounded">BEST</div>
                    <div className="text-xs text-[var(--color-primary-dark)] mb-1">Pharmacy B</div>
                    <div className="font-medium text-lg text-[var(--color-primary-dark)]">{formatCurrency(12.00)}</div>
                    <div className="text-[10px] text-[var(--color-primary)] mt-1">2.0 km away</div>
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                <h3 className="text-lg font-medium mb-3">Compare Your Options</h3>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                  Compare pharmacies based on things that matter, such as distance, price and expected time.
                </p>
              </CardContent>
            </Card>

            {/* Capability 4 */}
            <Card className="overflow-hidden group hover:shadow-elevated transition-shadow">
              <div className="h-48 bg-gray-50 border-b border-[var(--color-border-subtle)] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #0F766E 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
                {/* Visual Map Line */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="200" height="80" className="opacity-40" stroke="var(--color-primary)" strokeWidth="2" fill="none" strokeDasharray="4 4">
                    <path d="M 20 40 Q 60 10 100 40 T 180 40" />
                  </svg>
                  <div className="absolute left-[16px] w-3 h-3 bg-white border-2 border-gray-400 rounded-full"></div>
                  <div className="absolute left-[94px] top-[34px] w-4 h-4 bg-white border-2 border-[var(--color-primary)] rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full"></div></div>
                  <div className="absolute right-[14px] w-4 h-4 bg-[var(--color-primary)] rounded-full shadow-md flex items-center justify-center">
                    <MapPin className="h-2.5 w-2.5 text-white" />
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                <h3 className="text-lg font-medium mb-3">Plan Your Visits</h3>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                  Get a clear route for visiting the pharmacies you choose.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* PRODUCT PREVIEW */}
      <section className="py-32 px-6 bg-[var(--color-bg-base)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-[var(--color-primary)] mb-2 block">Application Interface</span>
            <h2 className="text-3xl font-medium mb-4 text-[var(--color-text-primary)]">Product Preview</h2>
          </div>
          
          <div className="relative mx-auto bg-white rounded-2xl shadow-elevated border border-[var(--color-border-subtle)] overflow-hidden">
            {/* Window header */}
            <div className="h-12 bg-gray-50 border-b border-[var(--color-border-subtle)] flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              </div>
              <div className="mx-auto bg-white border border-gray-200 rounded-md px-24 py-1 text-xs text-gray-400 font-medium font-mono">medioptima.app/results</div>
            </div>
            
            {/* Fake Interface */}
            <div className="flex flex-col md:flex-row h-full">
              <div className="w-full md:w-64 bg-[var(--color-bg-base)] border-r border-[var(--color-border-subtle)] p-6 hidden md:block">
                <div className="w-24 h-4 bg-gray-200 rounded mb-8"></div>
                <div className="space-y-4">
                  <div className="w-full h-3 bg-[var(--color-soft-green)] rounded"></div>
                  <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
                  <div className="w-5/6 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="flex-1 p-6 md:p-10 bg-white">
                <div className="flex justify-between items-end border-b border-[var(--color-border-subtle)] pb-4 mb-6">
                  <div>
                    <h3 className="text-xl font-medium mb-1">Visit Plan: Single-Stop</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">All 3 medicines found at 1 location.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-medium text-[var(--color-primary-dark)]">{formatCurrency(34.50)}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-5 border border-[var(--color-border-subtle)] relative">
                  <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                    <Badge variant="success">Pharmacy Reliability: High</Badge>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-[var(--color-border-subtle)] flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <p className="font-medium">CityHealth Pharmacy</p>
                      <p className="text-xs text-[var(--color-text-secondary)]">1.2 km away • Expected Time: 12 min</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pl-13">
                    <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                      <span>Paracetamol 500mg</span>
                      <span className="text-[var(--color-emerald-accent)] font-medium flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Available</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                      <span>Cetirizine 10mg</span>
                      <span className="text-[var(--color-emerald-accent)] font-medium flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Available</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Azithromycin 250mg</span>
                      <span className="text-[var(--color-emerald-accent)] font-medium flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEDICINE ALTERNATIVES / TRUST */}
      <section id="about" className="py-20 px-6 border-t border-[var(--color-border-subtle)] bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <Shield className="h-8 w-8 mx-auto text-gray-300 mb-6" />
          <h2 className="text-2xl font-medium mb-4 text-[var(--color-text-primary)]">Can't find a medicine?</h2>
          <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
            See other suitable options to discuss with your doctor or pharmacist.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            MediOptima is designed to help with finding medicines and planning pharmacy visits. 
            It does not replace a doctor, pharmacist or other qualified healthcare professional.
          </p>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 px-6 bg-[var(--color-bg-base)] border-t border-[var(--color-border-subtle)]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-medium mb-4 text-[var(--color-text-primary)]">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white border border-[var(--color-border-subtle)] rounded-xl overflow-hidden shadow-sm transition-all hover:border-[var(--color-border-hover)]"
              >
                <button 
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus:bg-gray-50 transition-colors"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaqIndex === index}
                >
                  <span className="font-medium text-[var(--color-text-primary)]">{faq.question}</span>
                  {openFaqIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
                  )}
                </button>
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaqIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-6 pb-5 text-[var(--color-text-secondary)] text-sm leading-relaxed border-t border-gray-50 pt-3">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 px-6 bg-white border-t border-[var(--color-border-subtle)]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-medium mb-4 text-[var(--color-text-primary)]">Have a question?</h2>
            <p className="text-[var(--color-text-secondary)]">
              We'd love to hear from you. Send us a message and we'll get back to you.
            </p>
          </div>
          
          <Card className="shadow-soft border-[var(--color-border-subtle)] overflow-hidden">
            <CardContent className="p-8">
              {submitStatus === 'success' ? (
                <div className="text-center py-12 animate-fade-in">
                  <div className="w-16 h-16 bg-[var(--color-soft-green)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--color-primary)]">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Message received!</h3>
                  <p className="text-[var(--color-text-secondary)] text-sm">
                    Thank you for reaching out. We'll be in touch soon.
                  </p>
                  <p className="text-gray-400 text-xs mt-6 italic">
                    (Note: This is a demo form. Real backend integration is pending.)
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5 text-left">
                      <label htmlFor="name" className="text-sm font-medium text-[var(--color-text-primary)]">Name</label>
                      <Input id="name" required placeholder="Jane Doe" className="bg-gray-50 focus:bg-white" />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label htmlFor="email" className="text-sm font-medium text-[var(--color-text-primary)]">Email</label>
                      <Input id="email" type="email" required placeholder="jane@example.com" className="bg-gray-50 focus:bg-white" />
                    </div>
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="subject" className="text-sm font-medium text-[var(--color-text-primary)]">Subject</label>
                    <Input id="subject" required placeholder="How can we help?" className="bg-gray-50 focus:bg-white" />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="message" className="text-sm font-medium text-[var(--color-text-primary)]">Message</label>
                    <textarea 
                      id="message" 
                      required 
                      rows="4" 
                      className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-gray-50 px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder-gray-400 focus:border-[var(--color-primary)] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-colors resize-none"
                      placeholder="Your message here..."
                    ></textarea>
                  </div>
                  
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                    <div className="text-sm text-gray-500">
                      Email: <span className="font-medium">support@medioptima.example</span>
                      <br />
                      <span className="text-xs text-gray-400 italic">(Configured environment variable)</span>
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-8 h-10 flex items-center justify-center">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-6 bg-[var(--color-primary-dark)] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-8 text-white">
            One request.<br />
            <span className="text-teal-300">A clearer way forward.</span>
          </h2>
          <Button size="lg" className="bg-white text-[var(--color-primary-dark)] hover:bg-gray-100 h-12 px-8 text-base shadow-lg" asChild>
            <Link to="/dashboard">Find Medicines</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
