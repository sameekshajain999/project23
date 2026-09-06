import React from 'react';
import {
  LayoutDashboard,
  Award,
  Briefcase,
  FileText,
  Building,
  GraduationCap,
  BookOpen,
  Building2,
  CheckCircle2,
  Compass,
  X,
  LogIn,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeSection?: string;
  onSectionSelect?: (section: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  onRoleChange,
  activeSection = 'dashboard',
  onSectionSelect,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { user, userProfile, openAuthModal, signOutUser } = useAuth();
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      role: 'student',
      action: () => {
        onRoleChange('student');
        onSectionSelect?.('all');
      },
    },
    {
      id: 'skills',
      label: 'Skill Mapping',
      icon: Award,
      role: 'student',
      action: () => {
        onRoleChange('student');
        onSectionSelect?.('skills');
      },
    },
    {
      id: 'opportunities',
      label: 'Opportunities',
      icon: Briefcase,
      role: 'student',
      action: () => {
        onRoleChange('student');
        onSectionSelect?.('opportunities');
      },
    },
    {
      id: 'logbook',
      label: 'Logbook',
      icon: FileText,
      role: 'student',
      action: () => {
        onRoleChange('student');
        onSectionSelect?.('logbook');
      },
    },
  ];

  const portals = [
    {
      id: 'student' as UserRole,
      label: 'Student Skill Passport',
      roleLabel: 'AIIA Student',
      studentId: 'ID: AY-2024-883',
      icon: GraduationCap,
    },
    {
      id: 'industry' as UserRole,
      label: 'Industry Recruiter',
      roleLabel: 'Dabur R&D Centre',
      studentId: 'ORG: DABUR-ASU',
      icon: Briefcase,
    },
    {
      id: 'faculty' as UserRole,
      label: 'Faculty Coordinator',
      roleLabel: 'Prof. Vashishta',
      studentId: 'FAC: AIIA-DELHI',
      icon: BookOpen,
    },
    {
      id: 'admin' as UserRole,
      label: 'Ayush Central Admin',
      roleLabel: 'Ministry of Ayush',
      studentId: 'GOV: AYUSH-CENTRAL',
      icon: Building2,
    },
  ];

  const currentRoleInfo = portals.find((p) => p.id === currentRole) || portals[0];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#1B4D3E] text-white">
      {/* Brand Header */}
      <div className="p-5 sm:p-6 flex items-center justify-between border-b border-emerald-800/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center font-bold text-white shadow-xs">
            AS
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight uppercase font-sans">
              AyushSetu
            </span>
            <span className="text-[9px] text-emerald-300 font-medium -mt-1 tracking-wider uppercase">
              AIIA • National Portal
            </span>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1 text-emerald-200 hover:text-white rounded"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Menu Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto space-y-6">
        <div>
          <div className="px-6 mb-2 text-[10px] uppercase tracking-widest text-emerald-400 font-semibold">
            Main Menu
          </div>
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRole === 'student' && activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onCloseMobile?.();
                  }}
                  className={`w-full flex items-center gap-3 px-6 py-2.5 text-left transition-colors ${
                    isActive
                      ? 'bg-emerald-900/50 border-r-4 border-emerald-400 text-white font-medium'
                      : 'text-emerald-100 hover:bg-emerald-800/30 font-normal'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'opacity-100 text-emerald-300' : 'opacity-70'
                    }`}
                  />
                  <span className="text-xs sm:text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stakeholder Switcher Section */}
        <div>
          <div className="px-6 mb-2 text-[10px] uppercase tracking-widest text-emerald-400 font-semibold">
            Portals & Stakeholders
          </div>
          <div className="space-y-0.5">
            {portals.map((p) => {
              const Icon = p.icon;
              const isActive = currentRole === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    onRoleChange(p.id);
                    onCloseMobile?.();
                  }}
                  className={`w-full flex items-center gap-3 px-6 py-2.5 text-left transition-colors ${
                    isActive
                      ? 'bg-emerald-900/50 border-r-4 border-emerald-400 text-white font-medium'
                      : 'text-emerald-100 hover:bg-emerald-800/30'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'opacity-100 text-emerald-300' : 'opacity-70'
                    }`}
                  />
                  <div className="flex-1 truncate">
                    <span className="text-xs sm:text-sm block truncate">{p.label}</span>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Role & Auth Context Bottom Box */}
      <div className="p-3.5 sm:p-4 border-t border-emerald-800/50">
        {user ? (
          <div className="bg-emerald-900/60 rounded-xl p-3 border border-emerald-700/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-emerald-300 font-semibold uppercase tracking-wider">
                Authenticated
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold text-white truncate">
                {userProfile?.displayName || user.displayName || user.email}
              </p>
              <p className="text-[10px] text-emerald-300 capitalize font-medium">
                {userProfile?.role || currentRole} • {userProfile?.organization || 'AIIA'}
              </p>
            </div>
            <button
              onClick={() => signOutUser()}
              className="w-full flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg bg-emerald-950/60 hover:bg-rose-900/60 text-emerald-200 hover:text-white text-[11px] font-medium transition-colors border border-emerald-800/50"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="bg-emerald-900/40 rounded-xl p-3 border border-emerald-800/40 text-center space-y-2">
            <div>
              <div className="text-[10px] text-emerald-300 font-semibold uppercase tracking-wider">
                Guest Mode
              </div>
              <div className="text-xs text-emerald-100 font-medium mt-0.5">
                Authentication Required for Actions
              </div>
            </div>
            <button
              onClick={() => openAuthModal('Sign In or Register with AyushSetu')}
              className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg bg-white text-[#1B4D3E] hover:bg-emerald-50 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-[#1B4D3E]" />
              <span>Sign In / Register</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent High-Density Sidebar */}
      <aside className="w-64 bg-[#1B4D3E] text-white hidden md:flex flex-col shrink-0 border-r border-emerald-900/50 select-none">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs md:hidden flex"
          onClick={onCloseMobile}
        >
          <div
            className="w-64 max-w-[80vw] h-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
