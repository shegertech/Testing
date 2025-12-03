
import React, { useState } from 'react';
import { api } from '../services/api';
import { User, StakeholderType, UserRole } from '../types';
import { THEMATIC_AREAS, COUNTRIES, INDIVIDUAL_SUBTYPES, ORGANIZATION_SUBTYPES, GROUP_SUBTYPES } from '../constants';
import { 
  Mail, Lock, User as UserIcon, ArrowRight, ArrowLeft, CheckCircle, Loader, X as XIcon,
  Briefcase, Lightbulb, DollarSign, Users, Globe, Shield, Heart
} from 'lucide-react';
import { AboutView, PrivacyView, TermsView, HelpView, ContactView, GuidelinesView } from './StaticPages';

interface AuthFlowProps {
  onLogin: (user: User) => void;
}

type AuthStep = 'landing' | 'login' | 'select-type' | 'register-form' | 'otp' | 'about' | 'privacy' | 'terms' | 'help' | 'contact' | 'guidelines';

const AuthFlow: React.FC<AuthFlowProps> = ({ onLogin }) => {
  const [step, setStep] = useState<AuthStep>('landing');
  const [formData, setFormData] = useState<Partial<User>>({
    country: COUNTRIES[0],
    focusAreas: [],
    role: UserRole.STANDARD,
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
        const user = await api.users.login(email, password);
        if (user) {
            onLogin(user);
        } else {
            setError("Login failed. Please check your credentials.");
        }
    } catch (err: any) {
        setError(err.message || "Login failed");
    } finally {
        setIsLoading(false);
    }
  };

  // Registration Handlers
  const handleTypeSelect = (type: StakeholderType) => {
    setFormData({ ...formData, stakeholderType: type });
    setStep('register-form');
    setError('');
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !email || !password) {
      setError("Please fill in all required fields");
      return;
    }
    
    // We skip the redundant "getAll()" check here because Firebase handles uniqueness securely on create.
    setStep('otp');
    setError('');
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In this app, we simulate the OTP check on the client side, then proceed to real Firebase creation
    if (otp === '123456') { 
      const newUser: User = {
        // ID will be overwritten by Firebase Service using the Auth UID
        id: `u${Date.now()}`,
        email: email,
        passwordHash: password, // Passed to service to create Auth account, then removed before DB save
        name: formData.name || '',
        stakeholderType: formData.stakeholderType!,
        subtype: formData.subtype,
        country: formData.country || 'Other',
        city: formData.city || '',
        focusAreas: formData.focusAreas || [],
        role: UserRole.STANDARD,
        isVerified: true,
        joinedAt: new Date().toISOString(),
        ...formData
      } as User;
      
      try {
         // This creates the Auth user AND saves the profile to Firestore
         const createdUser = await api.users.create(newUser);
         onLogin(createdUser);
      } catch (err: any) {
          setError(err.message);
          // If email exists, we might want to go back
          if (err.message.includes("already registered")) {
              setTimeout(() => setStep('register-form'), 2000);
          }
      }
    } else {
      setError("Invalid OTP code. Try 123456.");
    }
    setIsLoading(false);
  };

  const SubtypeOptions = () => {
    let options: string[] = [];
    if (formData.stakeholderType === StakeholderType.INDIVIDUAL) options = INDIVIDUAL_SUBTYPES;
    else if (formData.stakeholderType === StakeholderType.ORGANIZATION) options = ORGANIZATION_SUBTYPES;
    else if (formData.stakeholderType === StakeholderType.GROUP) options = GROUP_SUBTYPES;

    return (
      <select 
        className="w-full p-2 border border-gray-300 rounded mt-1"
        value={formData.subtype || ''}
        onChange={e => setFormData({...formData, subtype: e.target.value})}
        required
      >
        <option value="">Select Subtype</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  };

  const StaticPageFooter = () => (
    <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© 2025 Ponsectors. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
                <button onClick={() => setStep('about')} className="text-gray-400 hover:text-gray-500 text-sm">About</button>
                <button onClick={() => setStep('privacy')} className="text-gray-400 hover:text-gray-500 text-sm">Privacy Policy</button>
                <button onClick={() => setStep('terms')} className="text-gray-400 hover:text-gray-500 text-sm">Terms of Use</button>
                <button onClick={() => setStep('help')} className="text-gray-400 hover:text-gray-500 text-sm">Help</button>
            </div>
        </div>
    </footer>
  );

  // --- Landing View ---
  if (step === 'landing') {
    return (
      <div className="min-h-screen flex flex-col font-sans text-gray-900 relative bg-white overflow-x-hidden">
        {/* Abstract Background Elements - Fixed to viewport or top */}
        <div className="absolute top-0 left-0 w-full h-[120vh] overflow-hidden z-0 pointer-events-none">
             <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-50 mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
             <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-50 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
             <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] rounded-full bg-purple-50 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
             
             {/* Subtle Grid Pattern */}
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        {/* Header */}
        <nav className="relative z-20 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="flex items-center space-x-3 cursor-pointer select-none">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">P</div>
              <span className="text-2xl font-extrabold text-gray-900 tracking-tight">Ponsectors</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                  onClick={() => setStep('login')}
                  className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium transition hover:bg-gray-50 rounded-lg"
              >
                  Log In
              </button>
              <button
                  onClick={() => setStep('select-type')}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 transform hover:-translate-y-0.5"
              >
                  Get Started
              </button>
          </div>
        </nav>
  
        {/* Hero Section */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center pb-20 pt-10">
          <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-4 animate-fade-in-up">
                  ✨ The platform for social impact collaboration
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-gray-900 drop-shadow-sm">
                  Bridging sectors, catalyzing <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">collective action</span>
              </h1>
              
              <div className="space-y-6 max-w-3xl mx-auto">
                  <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
                      Share multi-sector projects, collaborate with stakeholders across different sectors to tackle complex social issues.
                  </p>
                  <p className="text-base md:text-lg text-gray-500 font-medium">
                      Discover impactful projects and insights from our global community. <br className="hidden md:block"/> Join a network of collaborators making a difference.
                  </p>
              </div>
  
              <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                      onClick={() => setStep('select-type')}
                      className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-full shadow-xl shadow-blue-200 hover:shadow-2xl hover:scale-105 transition transform duration-200"
                  >
                      Get Started for Free
                  </button>
                  <button
                     onClick={() => setStep('login')}
                     className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-lg font-semibold rounded-full shadow-sm hover:shadow-md transition"
                  >
                      Sign In
                  </button>
              </div>
              
              <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                  <div className="flex items-center justify-center font-bold text-gray-400 text-xl">NGOs</div>
                  <div className="flex items-center justify-center font-bold text-gray-400 text-xl">Governments</div>
                  <div className="flex items-center justify-center font-bold text-gray-400 text-xl">Universities</div>
                  <div className="flex items-center justify-center font-bold text-gray-400 text-xl">Startups</div>
              </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white relative z-10 py-24 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Make an Impact</h2>
                    <p className="text-xl text-gray-500">Powerful tools designed for cross-sector collaboration.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Projects */}
                    <div className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-gray-100 group">
                        <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                            <Briefcase className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Projects</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Create and manage multi-sector projects with clear goals and deliverables.
                        </p>
                    </div>

                    {/* Collaboration */}
                    <div className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-gray-100 group">
                        <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                            <Users className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Collaboration</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Invite collaborators via email or shareable links to work together.
                        </p>
                    </div>

                    {/* Insights */}
                    <div className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-gray-100 group">
                        <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform">
                            <Lightbulb className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Insights</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Share reflections and ideas on social issues with the community.
                        </p>
                    </div>

                    {/* Funding */}
                    <div className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-gray-100 group">
                        <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                            <DollarSign className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Funding</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Discover and share funding opportunities for impactful projects.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <StaticPageFooter />
      </div>
    );
  }

  // --- Static Pages View (About, Privacy, etc.) ---
  if (['about', 'privacy', 'terms', 'help', 'contact', 'guidelines'].includes(step)) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
             <nav className="bg-white shadow-sm p-4 sticky top-0 z-50">
               <div className="max-w-7xl mx-auto flex items-center justify-between">
                 <button onClick={() => setStep('landing')} className="flex items-center text-gray-600 hover:text-blue-600 transition font-medium">
                   <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
                 </button>
                 <div className="text-lg font-bold text-gray-900">Ponsectors</div>
               </div>
            </nav>
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
               {step === 'about' && <AboutView />}
               {step === 'privacy' && <PrivacyView />}
               {step === 'terms' && <TermsView />}
               {step === 'help' && <HelpView onNavigate={(v) => setStep(v)} />}
               {step === 'contact' && <ContactView />}
               {step === 'guidelines' && <GuidelinesView />}
            </main>
            <StaticPageFooter />
        </div>
    );
  }

  // --- Auth Forms (Login/Register) ---
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-8 relative">
      
      {/* Back to Home Button */}
      <button 
        onClick={() => setStep('landing')} 
        className="absolute top-6 left-6 p-2 bg-white hover:bg-gray-50 rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-blue-600 transition z-10 flex items-center gap-2 px-4"
      >
         <ArrowLeft className="w-4 h-4" /> <span className="text-sm font-medium">Home</span>
      </button>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md overflow-hidden relative z-0">
        
        {/* Header */}
        <div className="bg-white p-6 text-center border-b border-gray-50">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mx-auto mb-2 shadow-md">P</div>
          <h1 className="text-2xl font-bold text-gray-900">Ponsectors</h1>
          <p className="text-gray-500 text-sm mt-1">Collaborate for Impact</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg flex items-center">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}

          {/* Login View */}
          {step === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <h2 className="text-xl font-semibold text-gray-800 text-center">Welcome Back</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    className="pl-10 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2.5 border"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    className="pl-10 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2.5 border"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <button type="button" onClick={() => setStep('help')} className="text-blue-600 hover:text-blue-500 font-medium">Forgot password?</button>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition"
              >
                {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : "Log In"}
              </button>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  New here?{' '}
                  <button type="button" onClick={() => setStep('select-type')} className="font-bold text-blue-600 hover:text-blue-500">
                    Create an account
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* Select Type View */}
          {step === 'select-type' && (
            <div className="space-y-4">
              <button onClick={() => setStep('login')} className="text-sm text-gray-500 hover:text-gray-700 flex items-center mb-4 transition">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to login
              </button>
              <h2 className="text-xl font-bold text-gray-800 text-center mb-6">Who are you representing?</h2>
              
              <div className="grid gap-3">
                {[StakeholderType.INDIVIDUAL, StakeholderType.ORGANIZATION, StakeholderType.GROUP].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeSelect(type)}
                    className="flex items-center p-4 border rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group shadow-sm bg-gray-50"
                  >
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-700">{type}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {type === 'Individual' ? 'For professionals, researchers, students.' : 
                         type === 'Organization' ? 'For NGOs, companies, govt agencies.' : 
                         'For communities, coalitions, networks.'}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Registration Form */}
          {step === 'register-form' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <button type="button" onClick={() => setStep('select-type')} className="text-sm text-gray-500 hover:text-gray-700 flex items-center mb-2">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </button>
              <h2 className="text-lg font-bold text-gray-800">Sign Up as {formData.stakeholderType}</h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Subtype</label>
                  <SubtypeOptions />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {formData.stakeholderType === StakeholderType.INDIVIDUAL ? 'Full Name' : 
                     formData.stakeholderType === StakeholderType.ORGANIZATION ? 'Organization Name' : 'Group Name'}
                  </label>
                  <input
                    type="text"
                    className="block w-full border-gray-300 rounded-md border p-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.name || ''}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Country</label>
                    <select
                      className="block w-full border-gray-300 rounded-md border p-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.country}
                      onChange={e => setFormData({...formData, country: e.target.value})}
                    >
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      className="block w-full border-gray-300 rounded-md border p-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.city || ''}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                   <label className="block text-xs font-semibold text-gray-700 mb-2">Focus Areas (Select all that apply)</label>
                   <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded p-2 bg-gray-50">
                     {THEMATIC_AREAS.map(area => (
                       <label key={area} className="flex items-start space-x-2 text-xs text-gray-700 cursor-pointer hover:bg-white p-1 rounded transition">
                         <input 
                           type="checkbox"
                           checked={formData.focusAreas?.includes(area)}
                           onChange={(e) => {
                              const current = formData.focusAreas || [];
                              if (e.target.checked) {
                                  setFormData({...formData, focusAreas: [...current, area]});
                              } else {
                                  setFormData({...formData, focusAreas: current.filter(a => a !== area)});
                              }
                           }}
                           className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                         />
                         <span>{area}</span>
                       </label>
                     ))}
                   </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="block w-full border-gray-300 rounded-md border p-2 focus:ring-blue-500 focus:border-blue-500"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    className="block w-full border-gray-300 rounded-md border p-2 focus:ring-blue-500 focus:border-blue-500"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:opacity-50 transition mt-2"
              >
                {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : "Create Account"}
              </button>
            </form>
          )}

          {/* OTP View */}
          {step === 'otp' && (
            <div className="text-center space-y-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4 animate-bounce">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Verify your email</h2>
              <p className="text-sm text-gray-500">
                We sent a 6-digit code to <strong className="text-gray-900">{email}</strong>. Enter it below to confirm your account.
              </p>
              
              <form onSubmit={handleOtpVerify} className="space-y-4">
                <input
                  type="text"
                  maxLength={6}
                  className="block w-full text-center text-3xl tracking-widest border-gray-300 rounded-lg border p-3 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  placeholder="000000"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition"
                >
                   {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : "Verify Code"}
                </button>
              </form>
              
              <div className="text-sm pt-2">
                <button type="button" className="text-blue-600 hover:text-blue-500 font-bold">
                  Resend Code
                </button>
                <span className="mx-3 text-gray-300">|</span>
                <button type="button" onClick={() => setStep('register-form')} className="text-gray-500 hover:text-gray-700 font-medium">
                  Change Email
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-4 bg-gray-50 py-2 rounded">(For demo, use code 123456)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthFlow;
