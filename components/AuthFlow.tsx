import React, { useState } from 'react';
import { api } from '../services/mockStore';
import { User, StakeholderType, UserRole } from '../types';
import { THEMATIC_AREAS, COUNTRIES, INDIVIDUAL_SUBTYPES, ORGANIZATION_SUBTYPES, GROUP_SUBTYPES } from '../constants';
import { Mail, Lock, User as UserIcon, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

interface AuthFlowProps {
  onLogin: (user: User) => void;
}

type AuthStep = 'login' | 'select-type' | 'register-form' | 'otp';

const AuthFlow: React.FC<AuthFlowProps> = ({ onLogin }) => {
  const [step, setStep] = useState<AuthStep>('login');
  const [formData, setFormData] = useState<Partial<User>>({
    country: COUNTRIES[0],
    focusAreas: [],
    role: UserRole.STANDARD,
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  // Login Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = api.users.login(email, password);
    if (user) {
      if (!user.isVerified) {
        // In a real app, resend OTP and go to OTP screen
        setError("Account not verified. Please verify your email.");
        return;
      }
      onLogin(user);
    } else {
      setError("Invalid email or password");
    }
  };

  // Registration Handlers
  const handleTypeSelect = (type: StakeholderType) => {
    setFormData({ ...formData, stakeholderType: type });
    setStep('register-form');
    setError('');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name || !email || !password) {
      setError("Please fill in all required fields");
      return;
    }
    
    // Check if email exists
    const users = api.users.getAll();
    if (users.find(u => u.email === email)) {
      setError("Email already registered");
      return;
    }

    // Move to OTP
    setStep('otp');
    setError('');
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '123456') { // Mock OTP
      const newUser: User = {
        id: `u${Date.now()}`,
        email: email,
        passwordHash: password,
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
      
      api.users.create(newUser);
      onLogin(newUser);
    } else {
      setError("Invalid OTP code. Try 123456.");
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Ponsectors</h1>
          <p className="text-blue-100 text-sm mt-1">Collaborate for Impact</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg flex items-center">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}

          {/* Login View */}
          {step === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Welcome Back</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    className="pl-10 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2 border"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    className="pl-10 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2 border"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <a href="#" className="text-blue-600 hover:text-blue-500">Forgot password?</a>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Log In
              </button>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  New here?{' '}
                  <button type="button" onClick={() => setStep('select-type')} className="font-medium text-blue-600 hover:text-blue-500">
                    Create an account
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* Select Type View */}
          {step === 'select-type' && (
            <div className="space-y-4">
              <button onClick={() => setStep('login')} className="text-sm text-gray-500 hover:text-gray-700 flex items-center mb-4">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to login
              </button>
              <h2 className="text-xl font-semibold text-gray-800">Who are you representing?</h2>
              
              <div className="grid gap-3">
                {[StakeholderType.INDIVIDUAL, StakeholderType.ORGANIZATION, StakeholderType.GROUP].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeSelect(type)}
                    className="flex items-center p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{type}</h3>
                      <p className="text-xs text-gray-500">
                        {type === 'Individual' ? 'For professionals, researchers, students.' : 
                         type === 'Organization' ? 'For NGOs, companies, govt agencies.' : 
                         'For communities, coalitions, networks.'}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Registration Form */}
          {step === 'register-form' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <button type="button" onClick={() => setStep('select-type')} className="text-sm text-gray-500 hover:text-gray-700 flex items-center mb-2">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </button>
              <h2 className="text-lg font-semibold text-gray-800">Sign Up as {formData.stakeholderType}</h2>
              
              {/* Removed max-h-60 overflow-y-auto to allow full scrolling */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Subtype</label>
                  <SubtypeOptions />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    {formData.stakeholderType === StakeholderType.INDIVIDUAL ? 'Full Name' : 
                     formData.stakeholderType === StakeholderType.ORGANIZATION ? 'Organization Name' : 'Group Name'}
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md border p-2"
                    value={formData.name || ''}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Country</label>
                    <select
                      className="mt-1 block w-full border-gray-300 rounded-md border p-2"
                      value={formData.country}
                      onChange={e => setFormData({...formData, country: e.target.value})}
                    >
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md border p-2"
                      value={formData.city || ''}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                </div>
                
                {/* Checkbox List for Focus Areas */}
                <div>
                   <label className="block text-xs font-medium text-gray-700 mb-2">Focus Areas (Select all that apply)</label>
                   <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded p-2">
                     {THEMATIC_AREAS.map(area => (
                       <label key={area} className="flex items-start space-x-2 text-xs text-gray-700 cursor-pointer hover:bg-gray-50 p-1 rounded">
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
                  <label className="block text-xs font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="mt-1 block w-full border-gray-300 rounded-md border p-2"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    className="mt-1 block w-full border-gray-300 rounded-md border p-2"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"
              >
                Create Account
              </button>
            </form>
          )}

          {/* OTP View */}
          {step === 'otp' && (
            <div className="text-center space-y-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Verify your email</h2>
              <p className="text-sm text-gray-500">
                We sent a 6-digit code to <strong>{email}</strong>. Enter it below to confirm your account.
              </p>
              
              <form onSubmit={handleOtpVerify} className="space-y-4">
                <input
                  type="text"
                  maxLength={6}
                  className="block w-full text-center text-3xl tracking-widest border-gray-300 rounded-md border p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="000000"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Verify Code
                </button>
              </form>
              
              <div className="text-sm">
                <button type="button" className="text-blue-600 hover:text-blue-500 font-medium">
                  Resend Code
                </button>
                <span className="mx-2 text-gray-300">|</span>
                <button type="button" onClick={() => setStep('register-form')} className="text-gray-500 hover:text-gray-700">
                  Change Email
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-4">(For demo, use code 123456)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthFlow;