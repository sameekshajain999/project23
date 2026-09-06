import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  Star,
  Users,
  Award,
  CheckCircle,
  PlayCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { UpskillingRecommendation } from '../../types';

interface DynamicRoadmapProps {
  courses: UpskillingRecommendation[];
}

export const DynamicRoadmap: React.FC<DynamicRoadmapProps> = ({ courses }) => {
  const [courseList, setCourseList] = useState<UpskillingRecommendation[]>(courses);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleEnroll = (courseId: string) => {
    setCourseList((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const newStatus = c.status === 'Not Started' ? 'In Progress' : c.status;
          return {
            ...c,
            status: newStatus,
            progress: c.progress || 10,
          };
        }
        return c;
      })
    );
    const enrolledCourse = courseList.find((c) => c.id === courseId);
    setToastMessage(`Enrolled in ${enrolledCourse?.title.substring(0, 35)}... (Credits synced with AIIA registrar)`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div
      id="dynamic-upskilling-roadmap"
      className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-200" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-200 hover:text-white">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-black text-slate-900 font-serif">
              Dynamic Upskilling Roadmap
            </h3>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center">
              <Sparkles className="w-3 h-3 mr-1 text-emerald-600" />
              Syllabus Bridge AI
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Targeted micro-credentials aligned with NPTEL, SWAYAM, and CCRAS to bridge verified competency shortfalls.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
          <Award className="w-4 h-4 text-amber-600" />
          <span>Academic Credit Transfer Eligible</span>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courseList.map((course, idx) => {
          const isCompleted = course.status === 'Completed';
          const isInProgress = course.status === 'In Progress';

          return (
            <div
              key={course.id}
              id={`course-card-${course.id}`}
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3 bg-slate-50/40"
            >
              <div className="space-y-2">
                {/* Top Badge strip */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md">
                    {course.platform}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : isInProgress
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {course.status}
                  </span>
                </div>

                {/* Course Title */}
                <h4 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">
                  {course.title}
                </h4>

                {/* Target Gap indicator */}
                <div className="flex items-center text-xs text-emerald-800 font-medium">
                  <span className="text-slate-500 mr-1 text-[11px]">Bridges Gap:</span>
                  <span className="font-bold">{course.targetSkill}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {course.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 bg-white border border-slate-200 text-slate-600 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress Bar for In-Progress */}
              {isInProgress && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                    <span>Course Progress</span>
                    <span className="text-emerald-700 font-bold">{course.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Footer Meta & Action */}
              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3 text-slate-500 text-[11px]">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {course.duration}
                  </span>
                  <span className="flex items-center">
                    <Award className="w-3 h-3 mr-1 text-amber-600" />
                    {course.credits} Credits
                  </span>
                </div>

                <button
                  id={`course-action-btn-${course.id}`}
                  onClick={() => handleEnroll(course.id)}
                  disabled={isCompleted}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1 ${
                    isCompleted
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                      : isInProgress
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Certified</span>
                    </>
                  ) : isInProgress ? (
                    <>
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Resume Module</span>
                    </>
                  ) : (
                    <>
                      <span>Enroll Micro-Course</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
