export type UserRole = 'student' | 'industry' | 'faculty' | 'admin';

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  enrollmentNo: string;
  institute: string;
  program: string;
  yearOfStudy: string;
  cgpa: number;
  careerMatchScore: number; // 0 - 100
  badges: Array<{
    id: string;
    title: string;
    issuer: string;
    issuedDate: string;
    verificationCode: string;
    type: 'clinical' | 'regulatory' | 'research' | 'academic';
  }>;
  primarySpecialization: string;
  desiredRole: string;
  resumeUrl?: string;
  phone: string;
  email: string;
  location: string;
}

export interface SkillGapItem {
  skill: string;
  academicScore: number; // 0 - 100 (from syllabus)
  industryBenchmark: number; // 0 - 100 (market demand)
  gap: number; // benchmark - academic
  category: 'Clinical Protocol' | 'Industrial R&D' | 'Regulatory & QA' | 'Phytochemistry' | 'Digital Health';
  criticality: 'High' | 'Medium' | 'Low';
}

export interface UpskillingRecommendation {
  id: string;
  title: string;
  platform: 'NPTEL' | 'SWAYAM' | 'AIIA e-Vidya' | 'CCRAS Academy' | 'WHO-CC Ayurveda';
  targetSkill: string;
  duration: string;
  level: 'Intermediate' | 'Advanced' | 'Foundational';
  rating: number;
  enrolledCount: number;
  credits: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  progress?: number;
  link: string;
  tags: string[];
}

export interface JobPosting {
  id: string;
  title: string;
  organization: string;
  orgType: 'Herbal Pharmaceutical' | 'NABH Ayurvedic Hospital' | 'Clinical CRO' | 'Ayur-Tech Startup' | 'National Research Institute';
  location: string;
  workMode: 'On-site' | 'Hybrid' | 'Remote';
  type: 'Internship' | 'Full-time' | 'Fellowship';
  duration: string;
  stipend: string;
  matchScore: number; // Calculated skill fit %
  openings: number;
  deadline: string;
  verifiedGovtPartner: boolean;
  requiredSkills: string[];
  description: string;
  responsibilities: string[];
  eligibility: string;
  isBookmarked?: boolean;
  applied?: boolean;
}

export interface LogbookEntry {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  department: string;
  mentorName: string;
  industryOrHospital: string;
  procedureOrTask: string;
  hoursSpent: number;
  description: string;
  clinicalCasesObserved?: number;
  sopFollowed: string;
  facultyStatus: 'Approved' | 'Pending' | 'Needs Revision';
  industryStatus: 'Approved' | 'Pending' | 'Needs Revision';
  facultyFeedback?: string;
  industryFeedback?: string;
}

export interface KanbanCandidate {
  id: string;
  name: string;
  avatar: string;
  institute: string;
  degree: string;
  appliedRole: string;
  matchScore: number;
  stage: 'Applied' | 'Shortlisted' | 'Technical Interview' | 'Offer Dispatched';
  clinicalCertifications: string[];
  cgpa: number;
  appliedDate: string;
  notes?: string;
}

export interface MoUCollaboration {
  id: string;
  industryPartner: string;
  academicPartner: string;
  title: string;
  focusArea: string;
  signedDate: string;
  validTill: string;
  budgetAllocated: string;
  status: 'Active' | 'Under Review' | 'Milestone 2 Completed';
  studentFellowsCount: number;
  leadInvestigator: string;
}

export interface CurriculumDivergence {
  subject: string;
  academicHours: number;
  industryDemandWeight: number; // 0 - 100
  divergenceLevel: 'High Divergence' | 'Moderate Divergence' | 'Aligned';
  suggestedAdditions: string[];
}

export interface ApplicationRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  jobId: string;
  jobTitle: string;
  organization: string;
  matchScore: number;
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Offered' | 'Rejected';
  appliedDate: string;
  stipend?: string;
  location?: string;
  workMode?: string;
  notes?: string;
}

export interface AppointmentRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  facultyName: string;
  department: string;
  date: string;
  timeSlot: string;
  purpose: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled' | 'Rescheduled';
  createdAt: string;
}
