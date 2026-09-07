import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  UserCheck,
  Building,
  CheckCircle2,
  AlertCircle,
  FileText,
  CalendarCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFaculty?: string;
  defaultDepartment?: string;
  onSuccess?: () => void;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  isOpen,
  onClose,
  defaultFaculty = 'Prof. Ramakrishna Vashishta',
  defaultDepartment = 'Dept. of Kayachikitsa (Internal Medicine)',
  onSuccess,
}) => {
  const { user, requireAuth, bookAppointment } = useAuth();

  const [faculty, setFaculty] = useState(defaultFaculty);
  const [department, setDepartment] = useState(defaultDepartment);
  const [date, setDate] = useState('2025-04-10');
  const [timeSlot, setTimeSlot] = useState('03:30 PM - 04:30 PM');
  const [purpose, setPurpose] = useState('Clinical Residency & Logbook Sign-off Review');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Gate Booking: Open Login/Register modal if not authenticated
    if (!requireAuth('Please sign in or create an account to book your faculty appointment', 'student')) {
      return;
    }

    setLoading(true);
    try {
      await bookAppointment(faculty, department, date, timeSlot, purpose);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="book-appointment-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="book-appointment-modal"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1B4D3E] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-300 mb-1">
            <CalendarCheck className="w-4 h-4 text-amber-400" />
            <span>AIIA Academic & Clinical Guidance Cell</span>
          </div>

          <h3 className="text-xl font-black font-serif tracking-tight">
            Book Faculty Appointment
          </h3>

          <p className="text-xs text-emerald-100 mt-1">
            Schedule 1-on-1 mentorship, logbook countersign, or research protocol review.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Appointment Confirmed!</h4>
              <p className="text-xs text-slate-600">
                Your consultation request with <span className="font-semibold text-emerald-900">{faculty}</span> has been confirmed and saved to Firestore.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Faculty Mentor Selection */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Faculty Mentor / Guide
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={faculty}
                    onChange={(e) => {
                      setFaculty(e.target.value);
                      if (e.target.value.includes('Vashishta')) {
                        setDepartment('Dept. of Kayachikitsa (Internal Medicine)');
                      } else if (e.target.value.includes('Priya')) {
                        setDepartment('Dept. of Dravyaguna & Phytopharmacology');
                      } else {
                        setDepartment('Dept. of Shalya Tantra (Clinical Surgery)');
                      }
                    }}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
                  >
                    <option value="Prof. Ramakrishna Vashishta">
                      Prof. Ramakrishna Vashishta • Head, Kayachikitsa
                    </option>
                    <option value="Dr. Priya Namboodiri">
                      Dr. Priya Namboodiri • Dravyaguna & Clinical Pharmacology
                    </option>
                    <option value="Dr. Arvind Trivedi">
                      Dr. Arvind Trivedi • Shalya Tantra & Wound Healing
                    </option>
                  </select>
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Department</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    readOnly
                    value={department}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700 outline-none"
                  />
                </div>
              </div>

              {/* Date and Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Appointment Date</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Available Slot</label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
                    >
                      <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM (Morning)</option>
                      <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM (Afternoon)</option>
                      <option value="03:30 PM - 04:30 PM">03:30 PM - 04:30 PM (Evening)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Purpose of Meeting</label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    rows={3}
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Briefly state your query, clinical case discussion, or logbook verification requirements..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {!user && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    You are currently browsing in Guest Mode. Clicking "Book Appointment" will open the Sign In / Register dialog to verify your identity.
                  </span>
                </div>
              )}

              {/* Submit Actions */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-xl font-semibold text-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-[#1B4D3E] hover:bg-[#153e32] text-white rounded-xl font-bold shadow-md transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-70"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>{loading ? 'Submitting Booking...' : 'Book Appointment'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
