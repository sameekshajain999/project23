import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import { UserRole, ApplicationRecord, AppointmentRecord } from '../types';
import { INITIAL_APPLICATIONS, INITIAL_APPOINTMENTS } from '../data/mockData';

export interface UserProfileDoc {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  organization: string;
  phone?: string;
  resumeUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfileDoc | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalReason: string;
  authModalTargetRole: UserRole | undefined;
  openAuthModal: (reason?: string, targetRole?: UserRole) => void;
  closeAuthModal: () => void;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    pass: string,
    profileData: { displayName: string; role: UserRole; organization?: string; phone?: string }
  ) => Promise<void>;
  signInWithGoogle: (preferredRole?: UserRole) => Promise<void>;
  signOutUser: () => Promise<void>;
  requireAuth: (actionDescription: string, requiredRole?: UserRole) => boolean;
  applications: ApplicationRecord[];
  appointments: AppointmentRecord[];
  bookAppointment: (
    facultyName: string,
    department: string,
    date: string,
    timeSlot: string,
    purpose: string
  ) => Promise<string>;
  submitApplication: (
    jobId: string,
    jobTitle: string,
    organization: string,
    matchScore: number,
    stipend?: string,
    location?: string,
    workMode?: string
  ) => Promise<string>;
  uploadResume: (fileName: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileDoc | null>(null);
  const [loading, setLoading] = useState(true);

  // Applications and Appointments real-time state with persistent local cache
  const [applications, setApplications] = useState<ApplicationRecord[]>(() => {
    try {
      const cached = localStorage.getItem('ayushsetu_applications');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_APPLICATIONS;
  });

  const [appointments, setAppointments] = useState<AppointmentRecord[]>(() => {
    try {
      const cached = localStorage.getItem('ayushsetu_appointments');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_APPOINTMENTS;
  });

  // Auth gating modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState<string>('');
  const [authModalTargetRole, setAuthModalTargetRole] = useState<UserRole | undefined>(undefined);

  const openAuthModal = (reason = 'Please sign in to proceed', targetRole?: UserRole) => {
    setAuthModalReason(reason);
    setAuthModalTargetRole(targetRole);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthModalReason('');
    setAuthModalTargetRole(undefined);
  };

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const uid = currentUser.uid;
        let profile: UserProfileDoc | null = null;

        // 1. Try reading from Firestore
        try {
          const userDocRef = doc(db, 'users', uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            profile = userDoc.data() as UserProfileDoc;
          }
        } catch (error) {
          console.warn('Firestore profile fetch notice (using cache/fallback):', error);
          try {
            handleFirestoreError(error, OperationType.GET, `users/${uid}`);
          } catch (dErr) {
            console.warn('Diagnosed Firestore read permission issue:', dErr);
          }
        }

        // 2. Try loading from local storage cache
        if (!profile) {
          try {
            const cached = localStorage.getItem(`ayushsetu_profile_${uid}`);
            if (cached) {
              profile = JSON.parse(cached);
            }
          } catch (e) {
            // ignore
          }
        }

        // 3. Fallback profile if none exists
        if (!profile) {
          const email = currentUser.email || '';
          const detectedRole: UserRole = email.includes('recruiter') || email.includes('industry')
            ? 'industry'
            : email.includes('faculty') || email.includes('dean')
            ? 'faculty'
            : 'student';

          profile = {
            uid,
            email,
            displayName: currentUser.displayName || email.split('@')[0] || 'Ayush Scholar',
            role: detectedRole,
            organization:
              detectedRole === 'student'
                ? 'All India Institute of Ayurveda (AIIA)'
                : detectedRole === 'industry'
                ? 'Ayush Industry Partner'
                : 'AIIA Faculty / TPO Cell',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Attempt sync to Firestore in background
          try {
            await setDoc(doc(db, 'users', uid), profile);
          } catch (err) {
            console.warn('Notice syncing profile to Firestore:', err);
          }
        }

        // Cache locally for resilient subsequent loads
        try {
          localStorage.setItem(`ayushsetu_profile_${uid}`, JSON.stringify(profile));
        } catch (e) {}

        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Real-time Firestore Sync (onSnapshot) for Applications & Appointments
  useEffect(() => {
    let unsubscribeApps = () => {};
    let unsubscribeAppts = () => {};

    try {
      // 1. Applications collection listener
      const appsCollectionRef = collection(db, 'applications');
      unsubscribeApps = onSnapshot(
        appsCollectionRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const firestoreApps: ApplicationRecord[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              firestoreApps.push({
                id: docSnap.id,
                studentId: data.studentId || 'STU-AIIA-2024-89',
                studentName: data.studentName || 'Dr. Ananya Sharma',
                studentEmail: data.studentEmail,
                jobId: data.jobId,
                jobTitle: data.jobTitle,
                organization: data.organization,
                matchScore: data.matchScore || 90,
                status: data.status || 'Applied',
                appliedDate: data.appliedDate || new Date().toISOString().split('T')[0],
                stipend: data.stipend,
                location: data.location,
                workMode: data.workMode,
                notes: data.notes,
              });
            });

            setApplications((prev) => {
              const combinedMap = new Map<string, ApplicationRecord>();
              // Keep default/initial so initial experience isn't stripped
              INITIAL_APPLICATIONS.forEach((a) => combinedMap.set(a.jobId, a));
              prev.forEach((a) => combinedMap.set(a.jobId, a));
              firestoreApps.forEach((a) => combinedMap.set(a.jobId, a));
              const merged = Array.from(combinedMap.values());
              try {
                localStorage.setItem('ayushsetu_applications', JSON.stringify(merged));
              } catch (e) {}
              return merged;
            });
          }
        },
        (error) => {
          console.warn('Applications real-time sync notice (using persistent local cache):', error.message);
        }
      );

      // 2. Appointments collection listener
      const apptsCollectionRef = collection(db, 'appointments');
      unsubscribeAppts = onSnapshot(
        apptsCollectionRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const firestoreAppts: AppointmentRecord[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              firestoreAppts.push({
                id: docSnap.id,
                userId: data.userId || 'STU-AIIA-2024-89',
                userName: data.userName || 'Dr. Ananya Sharma',
                userEmail: data.userEmail,
                facultyName: data.facultyName,
                department: data.department,
                date: data.date,
                timeSlot: data.timeSlot,
                purpose: data.purpose,
                status: data.status || 'Confirmed',
                createdAt: data.createdAt || new Date().toISOString(),
              });
            });

            setAppointments((prev) => {
              const combinedMap = new Map<string, AppointmentRecord>();
              INITIAL_APPOINTMENTS.forEach((a) => combinedMap.set(a.id, a));
              prev.forEach((a) => combinedMap.set(a.id, a));
              firestoreAppts.forEach((a) => combinedMap.set(a.id, a));
              const merged = Array.from(combinedMap.values());
              try {
                localStorage.setItem('ayushsetu_appointments', JSON.stringify(merged));
              } catch (e) {}
              return merged;
            });
          }
        },
        (error) => {
          console.warn('Appointments real-time sync notice (using persistent local cache):', error.message);
        }
      );
    } catch (err) {
      console.warn('Failed initializing Firestore onSnapshot listeners:', err);
    }

    return () => {
      unsubscribeApps();
      unsubscribeAppts();
    };
  }, [user]);

  // Sign in with email and password
  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const uid = userCredential.user.uid;
      let profile: UserProfileDoc | null = null;

      try {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          profile = userDoc.data() as UserProfileDoc;
        }
      } catch (err) {
        console.warn('Notice reading profile from Firestore on sign-in:', err);
      }

      if (!profile) {
        try {
          const cached = localStorage.getItem(`ayushsetu_profile_${uid}`);
          if (cached) {
            profile = JSON.parse(cached);
          }
        } catch (e) {}
      }

      if (!profile) {
        const detectedRole: UserRole = email.includes('recruiter') || email.includes('industry')
          ? 'industry'
          : email.includes('faculty') || email.includes('dean')
          ? 'faculty'
          : 'student';

        profile = {
          uid,
          email: userCredential.user.email || email,
          displayName: userCredential.user.displayName || email.split('@')[0],
          role: detectedRole,
          organization:
            detectedRole === 'student'
              ? 'All India Institute of Ayurveda (AIIA)'
              : detectedRole === 'industry'
              ? 'Ayush Industry Partner'
              : 'AIIA Faculty / TPO Cell',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      try {
        localStorage.setItem(`ayushsetu_profile_${uid}`, JSON.stringify(profile));
      } catch (e) {}

      setUserProfile(profile);
      closeAuthModal();
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email, password, and save to Firestore 'users' collection
  const signUpWithEmail = async (
    email: string,
    pass: string,
    profileData: { displayName: string; role: UserRole; organization?: string; phone?: string }
  ) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const newUser = userCredential.user;

      if (profileData.displayName) {
        await updateProfile(newUser, { displayName: profileData.displayName });
      }

      const newProfile: UserProfileDoc = {
        uid: newUser.uid,
        email: newUser.email || email,
        displayName: profileData.displayName || email.split('@')[0],
        role: profileData.role,
        organization:
          profileData.organization ||
          (profileData.role === 'student'
            ? 'All India Institute of Ayurveda (AIIA)'
            : profileData.role === 'industry'
            ? 'Ayush Industry Partner'
            : 'Ayurveda Academic Faculty'),
        phone: profileData.phone || '+91 98765 43210',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // 1. Immediately cache locally so user session is guaranteed even if cloud rules reject write
      try {
        localStorage.setItem(`ayushsetu_profile_${newUser.uid}`, JSON.stringify(newProfile));
      } catch (e) {}

      // 2. Store in Firestore 'users' collection with graceful non-fatal diagnostic handling
      try {
        await setDoc(doc(db, 'users', newUser.uid), newProfile);
      } catch (err) {
        console.warn('Notice saving profile to Firestore (using local session fallback):', err);
        try {
          handleFirestoreError(err, OperationType.WRITE, `users/${newUser.uid}`);
        } catch (diagErr) {
          console.warn('Diagnosed Firestore permission issue for users collection:', diagErr);
        }
      }

      setUserProfile(newProfile);
      closeAuthModal();
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async (preferredRole: UserRole = 'student') => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const gUser = result.user;
      const uid = gUser.uid;
      let profile: UserProfileDoc | null = null;

      try {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          profile = userDoc.data() as UserProfileDoc;
        }
      } catch (err) {
        console.warn('Notice fetching Google user profile from Firestore:', err);
      }

      if (!profile) {
        try {
          const cached = localStorage.getItem(`ayushsetu_profile_${uid}`);
          if (cached) {
            profile = JSON.parse(cached);
          }
        } catch (e) {}
      }

      if (!profile) {
        profile = {
          uid,
          email: gUser.email || '',
          displayName: gUser.displayName || 'Ayush Scholar',
          role: preferredRole,
          organization:
            preferredRole === 'student'
              ? 'All India Institute of Ayurveda (AIIA)'
              : preferredRole === 'industry'
              ? 'Herbal & Ayurvedic Enterprise'
              : 'Ayush Faculty & TPO Cell',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        try {
          await setDoc(doc(db, 'users', uid), profile);
        } catch (err) {
          console.warn('Google first-time profile write notice:', err);
        }
      }

      try {
        localStorage.setItem(`ayushsetu_profile_${uid}`, JSON.stringify(profile));
      } catch (e) {}

      setUserProfile(profile);
      closeAuthModal();
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign Out
  const signOutUser = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  // Requirement 2 & 3: Require authentication helper
  const requireAuth = (actionDescription: string, requiredRole?: UserRole): boolean => {
    if (!user) {
      openAuthModal(actionDescription, requiredRole);
      return false;
    }
    if (requiredRole && userProfile && userProfile.role !== requiredRole && userProfile.role !== 'admin') {
      openAuthModal(
        `This action requires an authenticated ${
          requiredRole === 'student'
            ? 'Student'
            : requiredRole === 'industry'
            ? 'Industry Recruiter'
            : 'Academic Faculty / TPO'
        } account. Please sign in with the appropriate credentials.`,
        requiredRole
      );
      return false;
    }
    return true;
  };

  // Requirement 3 & 4: Book Appointment with Real-time & Local Persistence
  const bookAppointment = async (
    facultyName: string,
    department: string,
    date: string,
    timeSlot: string,
    purpose: string
  ): Promise<string> => {
    if (!user) {
      openAuthModal('Please sign in or register to book a faculty consultation appointment');
      throw new Error('Authentication required');
    }

    const bookingData = {
      userId: user.uid,
      userName: userProfile?.displayName || user.displayName || user.email || 'Dr. Ananya Sharma',
      userEmail: user.email || 'ananya.sharma@aiia.gov.in',
      facultyName,
      department,
      date,
      timeSlot,
      purpose,
      status: 'Confirmed' as const,
      createdAt: new Date().toISOString(),
    };

    const localId = `APT-${Date.now().toString().slice(-4)}`;
    const newRecord: AppointmentRecord = {
      id: localId,
      ...bookingData,
    };

    // Immediate state & local storage update
    setAppointments((prev) => {
      const updated = [newRecord, ...prev];
      try {
        localStorage.setItem('ayushsetu_appointments', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      const docRef = await addDoc(collection(db, 'appointments'), bookingData);
      return docRef.id;
    } catch (err) {
      console.warn('Booking stored locally with fallback:', err);
      return localId;
    }
  };

  // Requirement 3 & 4: Submit Internship Application ("Apply Now") with Real-time & Local Persistence
  const submitApplication = async (
    jobId: string,
    jobTitle: string,
    organization: string,
    matchScore: number,
    stipend?: string,
    location?: string,
    workMode?: string
  ): Promise<string> => {
    if (!user) {
      openAuthModal('Please sign in or register to submit your verified internship application');
      throw new Error('Authentication required');
    }

    const appData = {
      studentId: user.uid,
      studentName: userProfile?.displayName || user.displayName || 'Dr. Ananya Sharma',
      studentEmail: user.email || 'ananya.sharma@aiia.gov.in',
      jobId,
      jobTitle,
      organization,
      matchScore,
      stipend: stipend || '₹38,000 / month + Lab Allowances',
      location: location || 'Sarita Vihar, New Delhi',
      workMode: workMode || 'On-site',
      status: 'Applied' as const,
      appliedDate: new Date().toISOString().split('T')[0],
      notes: 'Application registered in Ministry National Internship Portal',
    };

    const localId = `APP-${Date.now().toString().slice(-4)}`;
    const newRecord: ApplicationRecord = {
      id: localId,
      ...appData,
    };

    // Immediate state & local storage update
    setApplications((prev) => {
      const updated = [newRecord, ...prev.filter((p) => p.jobId !== jobId)];
      try {
        localStorage.setItem('ayushsetu_applications', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      const docRef = await addDoc(collection(db, 'applications'), appData);
      return docRef.id;
    } catch (err) {
      console.warn('Application submitted with local confirmation fallback:', err);
      return localId;
    }
  };

  // Requirement 2: Resume upload helper
  const uploadResume = async (fileName: string): Promise<string> => {
    if (!user) {
      openAuthModal('Please sign in as a Student to upload and verify your resume', 'student');
      throw new Error('Authentication required');
    }
    const fakeUrl = `https://storage.ayushsetu.gov.in/resumes/${user.uid}/${encodeURIComponent(fileName)}`;
    if (userProfile) {
      try {
        await setDoc(
          doc(db, 'users', user.uid),
          { ...userProfile, resumeUrl: fakeUrl, updatedAt: new Date().toISOString() },
          { merge: true }
        );
        setUserProfile((prev) => (prev ? { ...prev, resumeUrl: fakeUrl } : null));
      } catch (err) {
        console.warn('Resume updated locally:', err);
      }
    }
    return fakeUrl;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isAuthModalOpen,
        authModalReason,
        authModalTargetRole,
        openAuthModal,
        closeAuthModal,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOutUser,
        requireAuth,
        applications,
        appointments,
        bookAppointment,
        submitApplication,
        uploadResume,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
