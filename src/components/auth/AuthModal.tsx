import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Building,
  GraduationCap,
  Briefcase,
  BookOpen,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff,
  Copy,
  Check,
  Database,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalReason,
    authModalTargetRole,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    loading,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [role, setRole] = useState<UserRole>(authModalTargetRole || 'student');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showRulesHelper, setShowRulesHelper] = useState(false);
  const [copiedRules, setCopiedRules] = useState(false);

  const recommendedRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    match /users/{userId} {
      allow get, list: if isSignedIn();
      allow create, update: if isOwner(userId);
      allow delete: if false;
    }
    match /appointments/{appointmentId} {
      allow read, list: if isSignedIn();
      allow create: if isSignedIn();
      allow update, delete: if isSignedIn();
    }
    match /applications/{applicationId} {
      allow read, list: if isSignedIn();
      allow create: if isSignedIn();
      allow update, delete: if isSignedIn();
    }
  }
}`;

  const copyRulesToClipboard = () => {
    navigator.clipboard.writeText(recommendedRules);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 2500);
  };

  // Sync role if target role changes
  React.useEffect(() => {
    if (authModalTargetRole) {
      setRole(authModalTargetRole);
    }
  }, [authModalTargetRole]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    if (mode === 'signup' && !displayName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, {
          displayName,
          role,
          organization:
            organization.trim() ||
            (role === 'student'
              ? 'All India Institute of Ayurveda (AIIA)'
              : role === 'industry'
              ? 'Ayurvedic Pharmaceutical Partner'
              : 'AIIA Faculty & TPO'),
          phone: phone.trim() || '+91 98765 43210',
        });
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err.message || 'Authentication failed. Please check your credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = 'Invalid email or password. If you do not have an account, click "New User: Create Account".';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please switch to "Existing User: Sign In".';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        msg = 'Google sign-in popup was cancelled.';
      } else if (typeof msg === 'string' && (msg.includes('Missing or insufficient permissions') || msg.includes('Firestore Error'))) {
        msg = 'Account authenticated with Firebase. Firestore rules note: local session persistence active.';
      }
      setErrorMessage(msg);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    try {
      await signInWithGoogle(role);
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign-in failed.');
    }
  };

  // Demo autofill for quick testing
  const prefillCredentials = (demoRole: UserRole) => {
    setRole(demoRole);
    if (demoRole === 'student') {
      setEmail('student.ananya@aiia.gov.in');
      setPassword('Ayush@2025');
      setDisplayName('Dr. Ananya Sharma');
      setOrganization('All India Institute of Ayurveda (AIIA)');
    } else if (demoRole === 'industry') {
      setEmail('recruiter@dabur.com');
      setPassword('Ayush@2025');
      setDisplayName('Dr. Vikramaditya Sen');
      setOrganization('Dabur Research & Development');
    } else {
      setEmail('faculty.vashishta@aiia.gov.in');
      setPassword('Ayush@2025');
      setDisplayName('Prof. Ramakrishna Vashishta');
      setOrganization('AIIA Kayachikitsa & TPO Cell');
    }
    setErrorMessage(null);
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={closeAuthModal}
    >
      <div
        id="auth-modal"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-[#1B4D3E] text-white p-5 relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-300 mb-1">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>National Ayush Skill Registry • Firebase Authenticated</span>
          </div>

          <h3 className="text-xl font-black font-serif tracking-tight">
            {mode === 'signin' ? 'Sign In to AyushSetu' : 'Register National Ayush Account'}
          </h3>

          <p className="text-xs text-emerald-100/90 mt-1">
            {authModalReason || 'Access verified student passports, recruitment pipelines, and clinical logbooks.'}
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              mode === 'signin'
                ? 'border-[#1B4D3E] text-[#1B4D3E] bg-white font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Existing User: Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              mode === 'signup'
                ? 'border-[#1B4D3E] text-[#1B4D3E] bg-white font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            New User: Create Account
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Role Picker (Required for 3 roles: Student, Industry, Faculty) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Stakeholder Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {/* Role 1: Student */}
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  role === 'student'
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <GraduationCap
                  className={`w-4 h-4 mb-1.5 ${
                    role === 'student' ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                />
                <span className="font-bold text-xs leading-tight">Student</span>
                <span className="text-[10px] text-slate-500 leading-tight mt-0.5">
                  Resume & Internships
                </span>
              </button>

              {/* Role 2: Industry Recruiter */}
              <button
                type="button"
                onClick={() => setRole('industry')}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  role === 'industry'
                    ? 'border-amber-600 bg-amber-50/80 text-amber-950 ring-1 ring-amber-500'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Briefcase
                  className={`w-4 h-4 mb-1.5 ${
                    role === 'industry' ? 'text-amber-700' : 'text-slate-400'
                  }`}
                />
                <span className="font-bold text-xs leading-tight">Recruiter</span>
                <span className="text-[10px] text-slate-500 leading-tight mt-0.5">
                  Post Jobs & Candidates
                </span>
              </button>

              {/* Role 3: Academic Faculty / TPO */}
              <button
                type="button"
                onClick={() => setRole('faculty')}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  role === 'faculty'
                    ? 'border-blue-600 bg-blue-50/80 text-blue-950 ring-1 ring-blue-500'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <BookOpen
                  className={`w-4 h-4 mb-1.5 ${
                    role === 'faculty' ? 'text-blue-700' : 'text-slate-400'
                  }`}
                />
                <span className="font-bold text-xs leading-tight">Faculty / TPO</span>
                <span className="text-[10px] text-slate-500 leading-tight mt-0.5">
                  Verify & Analytics
                </span>
              </button>
            </div>
          </div>

          {/* Quick Demo Credentials Autofill */}
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">Quick Demo Autofill:</span>
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => prefillCredentials('student')}
                className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => prefillCredentials('industry')}
                className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Recruiter
              </button>
              <button
                type="button"
                onClick={() => prefillCredentials('faculty')}
                className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Faculty
              </button>
            </div>
          </div>

          {/* Alerts */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Full Name on Sign Up */}
            {mode === 'signup' && (
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Dr. Ananya Sharma"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.gov.in"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Additional details for Sign Up */}
            {mode === 'signup' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {role === 'student' ? 'Institute' : role === 'industry' ? 'Company / R&D Unit' : 'Academic Dept'}
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder={role === 'student' ? 'AIIA New Delhi' : 'Dabur India Ltd.'}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 bg-[#1B4D3E] hover:bg-[#153e32] text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/10 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70"
            >
              <span>
                {loading
                  ? 'Verifying Credentials...'
                  : mode === 'signin'
                  ? 'Sign In to Portal'
                  : 'Register & Save Profile in Firestore'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Social Google Sign-in */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
              <span className="bg-white px-2">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>

        {/* Footer info & Rules Helper */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              <span>Firebase Auth & Firestore Linked (ayushsetu-e0158)</span>
            </span>
            <button
              type="button"
              onClick={() => setShowRulesHelper(!showRulesHelper)}
              className="text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
            >
              {showRulesHelper ? 'Hide Rules' : 'Firebase Rules Guide'}
            </button>
          </div>

          {showRulesHelper && (
            <div className="mt-2.5 p-3 bg-white rounded-lg border border-slate-200 text-left space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-[11px] flex items-center space-x-1">
                  <Database className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cloud Firestore Security Rules for Console:</span>
                </span>
                <button
                  type="button"
                  onClick={copyRulesToClipboard}
                  className="flex items-center space-x-1 px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded font-bold text-[10px] cursor-pointer"
                >
                  {copiedRules ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3 text-emerald-700" />}
                  <span>{copiedRules ? 'Copied!' : 'Copy Rules'}</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                To sync data across all remote clients, paste these rules into your{' '}
                <a
                  href="https://console.firebase.google.com/project/ayushsetu-e0158/firestore/rules"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 underline font-medium"
                >
                  Firebase Console &gt; Firestore &gt; Rules
                </a>{' '}
                and click <strong>Publish</strong>.
              </p>
              <pre className="p-2 bg-slate-900 text-slate-200 rounded text-[9px] font-mono overflow-x-auto max-h-32">
                {recommendedRules}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
