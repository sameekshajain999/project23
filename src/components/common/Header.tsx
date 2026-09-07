import React, { useState } from 'react';
import {
  Search,
  Bell,
  GraduationCap,
  Briefcase,
  BookOpen,
  Building2,
  ChevronDown,
  ExternalLink,
  CheckCircle,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  LogIn,
  LogOut,
  User,
} from 'lucide-react';
import { UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenSearch: () => void;
  onToggleMobileMenu?: () => void;
  studentName?: string;
  studentSubtitle?: string;
  studentAvatar?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenSearch,
  onToggleMobileMenu,
  studentName = 'Dr. Ananya Sharma',
  studentSubtitle = 'BAMS Semester VIII • AIIA',
  studentAvatar = 'https://images.unsplash.com/photo-1594824813627-8488344e2182?auto=format&fit=crop&q=80&w=256',
}) => {
  const { user, userProfile, openAuthModal, signOutUser } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const roles = [
    {
      id: 'student' as UserRole,
      label: 'Student Portal',
      subtitle: 'Internships, Skill Mapping, Digital Logbook',
      badge: 'Dr. Ananya (AIIA)',
      icon: GraduationCap,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'industry' as UserRole,
      label: 'Industry Recruiter',
      subtitle: 'Talent Pipeline & Verified Candidate Search',
      badge: 'Dabur R&D / Himalaya',
      icon: Briefcase,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      id: 'faculty' as UserRole,
      label: 'Faculty Coordinator',
      subtitle: 'Curriculum Divergence & Logbook Approval',
      badge: 'Prof. Vashishta (AIIA)',
      icon: BookOpen,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      id: 'admin' as UserRole,
      label: 'Ayush Central Admin',
      subtitle: 'National KPIs, MoUs, Skill Repository',
      badge: 'Ministry of Ayush',
      icon: Building2,
      color: 'text-purple-700 bg-purple-50 border-purple-200',
    },
  ];

  const notifications = [
    {
      id: 'n1',
      title: 'Interview Request Dispatched',
      description: 'Dabur Research Centre scheduled a technical interaction for R&D Formulation Fellow.',
      time: '15m ago',
      read: false,
    },
    {
      id: 'n2',
      title: 'Faculty Sign-off Granted',
      description: 'Prof. Ramakrishna Vashishta approved your Kayachikitsa & Virechana logbook submission.',
      time: '2h ago',
      read: false,
    },
    {
      id: 'n3',
      title: 'New Industry MoU Executed',
      description: 'AIIA and Himalaya Wellness signed an active capstone agreement on Phytopharmacology.',
      time: '1d ago',
      read: true,
    },
  ];

  const activeRoleObj = roles.find((r) => r.id === currentRole) || roles[0];
  const ActiveIcon = activeRoleObj.icon;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Main High-Density Navigation Bar */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Mobile Toggle & Quick Search */}
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            {onToggleMobileMenu && (
              <button
                id="sidebar-mobile-toggle-btn"
                onClick={onToggleMobileMenu}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                title="Toggle Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            {/* High Density Pill Search Bar */}
            <div className="relative w-full max-w-xs sm:max-w-md">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search opportunities, institutions, clinical skills..."
                onClick={onOpenSearch}
                readOnly
                className="w-full pl-10 pr-12 py-2 bg-slate-100 hover:bg-slate-200/70 cursor-pointer border-none rounded-full text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400 text-slate-800"
              />
              <kbd className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right: Verified Pill, Notifications, Role Switcher, and Profile */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {/* High Density Verified by AIIA Pill */}
            <div className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-tight whitespace-nowrap">
                Verified by AIIA
              </span>
            </div>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                id="notifications-dropdown-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white"></span>
              </button>

              {showNotifications && (
                <div
                  id="notifications-menu"
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-xs text-slate-900">National Notifications</h3>
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                        2 New
                      </span>
                    </div>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs"
                    >
                      Close
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 hover:bg-slate-50 transition-colors text-xs ${
                          !notif.read ? 'bg-emerald-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <p className="font-bold text-slate-900">{notif.title}</p>
                          <span className="text-[10px] text-slate-400">{notif.time}</span>
                        </div>
                        <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                          {notif.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Demo Dropdown */}
            <div className="relative">
              <button
                id="role-switcher-toggle-btn"
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center space-x-2 pl-2.5 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all text-xs font-semibold text-slate-800"
              >
                <div className={`p-1 rounded-md ${activeRoleObj.color}`}>
                  <ActiveIcon className="w-3.5 h-3.5" />
                </div>
                <div className="text-left hidden sm:block">
                  <span className="block text-[10px] font-normal text-slate-500 uppercase tracking-wider">
                    Role View
                  </span>
                  <span className="block font-bold leading-tight">{activeRoleObj.label}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleDropdown && (
                <div
                  id="role-switcher-dropdown"
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Active Persona
                    </p>
                    <p className="text-xs text-slate-600">
                      Explore the platform from all 4 stakeholders
                    </p>
                  </div>
                  <div className="space-y-1">
                    {roles.map((r) => {
                      const Icon = r.icon;
                      const isSelected = r.id === currentRole;
                      return (
                        <button
                          key={r.id}
                          id={`switch-role-${r.id}-btn`}
                          onClick={() => {
                            onRoleChange(r.id);
                            setShowRoleDropdown(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-lg flex items-start space-x-3 transition-colors ${
                            isSelected
                              ? 'bg-emerald-50/80 border border-emerald-200 text-emerald-950'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div
                            className={`p-1.5 rounded-md mt-0.5 ${
                              isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs">{r.label}</span>
                              {isSelected && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug">{r.subtitle}</p>
                            <span className="text-[10px] text-slate-400 font-mono mt-0.5 inline-block">
                              Demo: {r.badge}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* High Density User Profile & Auth Controls */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              {user ? (
                <div className="flex items-center gap-2.5">
                  <div className="hidden lg:block text-right">
                    <div className="text-xs sm:text-sm font-bold leading-none text-slate-900 flex items-center justify-end space-x-1">
                      <span>{userProfile?.displayName || user.displayName || user.email?.split('@')[0]}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" title="Verified Session" />
                    </div>
                    <div className="text-[10px] text-emerald-700 mt-1 uppercase tracking-tight font-semibold flex items-center justify-end space-x-1">
                      <span>{userProfile?.role?.toUpperCase() || currentRole.toUpperCase()}</span>
                      <span>•</span>
                      <span className="text-slate-500">{userProfile?.organization || 'AIIA National'}</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-100 border-2 border-emerald-500 p-0.5 shadow-2xs shrink-0 overflow-hidden flex items-center justify-center font-bold text-xs text-emerald-900">
                    {userProfile?.displayName ? (
                      userProfile.displayName.charAt(0).toUpperCase()
                    ) : (
                      <User className="w-4 h-4 text-emerald-700" />
                    )}
                  </div>
                  <button
                    id="header-signout-btn"
                    onClick={() => signOutUser()}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 text-slate-500 transition-all cursor-pointer"
                    title="Sign Out of AyushSetu"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  id="header-signin-btn"
                  onClick={() => openAuthModal('Sign In or Register with AyushSetu')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#1B4D3E] hover:bg-[#153e32] text-white rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-300" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
