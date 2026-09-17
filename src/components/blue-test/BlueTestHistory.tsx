import React, { useState } from 'react';
import { BlueAssignment } from '../../types/blue-test';
import { BlueTestStorageAdapter } from '../../persistence/blue-test-storage';
import { calculatePercentIMetrics } from '../../domain/blue-test/metrics-engine';
import { LearnerAvatar } from '../common/LearnerAvatar';
import {
  History,
  Search,
  Filter,
  Play,
  BarChart2,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  FileText,
  Trash2,
  RotateCcw,
} from 'lucide-react';

interface BlueTestHistoryProps {
  onSelectAssignment: (assignment: BlueAssignment, targetView: 'room' | 'analysis') => void;
}

export const BlueTestHistory: React.FC<BlueTestHistoryProps> = ({ onSelectAssignment }) => {
  const [assignments, setAssignments] = useState<BlueAssignment[]>(() =>
    BlueTestStorageAdapter.getAssignments()
  );
  const learners = BlueTestStorageAdapter.getLearners(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLearnerFilter, setSelectedLearnerFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Deletion modals state
  const [deletingAssignment, setDeletingAssignment] = useState<BlueAssignment | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState<boolean>(false);

  const reloadAssignments = () => {
    setAssignments(BlueTestStorageAdapter.getAssignments());
  };

  const handleDeleteAssignment = () => {
    if (!deletingAssignment) return;
    BlueTestStorageAdapter.deleteAssignment(deletingAssignment.id);
    reloadAssignments();
    setDeletingAssignment(null);
  };

  const handleClearAllHistory = () => {
    BlueTestStorageAdapter.clearAllHistory();
    reloadAssignments();
    setShowClearAllModal(false);
  };

  const learnerMap = new Map();
  learners.forEach((l) => learnerMap.set(l.id, l));

  const filteredAssignments = assignments.filter((ass) => {
    const learner = learnerMap.get(ass.learnerId);
    if (selectedLearnerFilter !== 'all' && ass.learnerId !== selectedLearnerFilter) return false;
    if (selectedStatusFilter !== 'all' && ass.status !== selectedStatusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const learnerName = learner?.name.toLowerCase() || '';
      const learnerCode = learner?.code.toLowerCase() || '';
      const assId = ass.id.toLowerCase();
      return learnerName.includes(q) || learnerCode.includes(q) || assId.includes(q);
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-900">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-blue-600" />
            Blue Test History & Audit Log
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review historical completed or partial Blue Test assignments, manage records, and resume active sessions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {assignments.length > 0 && (
            <button
              onClick={() => setShowClearAllModal(true)}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All History
            </button>
          )}

          <div className="flex items-center gap-2 bg-blue-50 text-blue-900 px-3 py-1.5 rounded-xl text-xs font-bold border border-blue-200">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Total Records: {assignments.length}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search learner name, code or ID..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs w-full md:w-auto">
          {/* Learner Filter */}
          <select
            value={selectedLearnerFilter}
            onChange={(e) => setSelectedLearnerFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Learners</option>
            {learners.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.code})
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="in_progress">In Progress / Partial</option>
            <option value="completed">Completed</option>
            <option value="not_started">Not Started</option>
          </select>
        </div>
      </div>

      {/* Assignments Table / List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 text-xs space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-700">No test history records match the filter.</p>
            <p>Try clearing search or selecting a different status filter.</p>
          </div>
        ) : (
          filteredAssignments.map((ass) => {
            const learner = learnerMap.get(ass.learnerId) || {
              name: 'Unknown Learner',
              code: 'N/A',
            };
            const attempts = BlueTestStorageAdapter.getAttempts(ass.id);
            const metrics = calculatePercentIMetrics(attempts);

            const isCompleted = ass.status === 'completed';

            return (
              <div
                key={ass.id}
                className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Learner Info & Status */}
                <div className="flex items-center gap-4">
                  <LearnerAvatar learner={learner} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">{learner.name}</span>
                      <span className="text-xs text-slate-500 font-mono">({learner.code})</span>
                      {isCompleted ? (
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-extrabold rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" /> In Progress ({metrics.finalizedCount}/49)
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 font-medium space-x-2">
                      <span>Assigned: {new Date(ass.assignedAt).toLocaleDateString()}</span>
                      <span>• ID: {ass.id}</span>
                      {ass.completedAt && (
                        <span>• Completed: {new Date(ass.completedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Metrics Summary & Actions */}
                <div className="flex flex-wrap items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 text-xs">
                  {/* %i Display */}
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 block lowercase">%i</span>
                    <span className="text-xl font-black text-blue-600 font-mono">
                      {metrics.provisionalPercentI !== null
                        ? `${metrics.provisionalPercentI.toFixed(1)}%`
                        : '—'}
                    </span>
                  </div>

                  {/* Completion Count */}
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Completion</span>
                    <span className="text-sm font-black text-slate-800 font-mono">
                      {metrics.finalizedCount} / 49
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {!isCompleted ? (
                      <button
                        onClick={() => onSelectAssignment(ass, 'room')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5" /> Resume Test
                      </button>
                    ) : (
                      <button
                        onClick={() => onSelectAssignment(ass, 'analysis')}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-all flex items-center gap-1.5"
                      >
                        <BarChart2 className="w-3.5 h-3.5 text-blue-600" /> View Analysis
                      </button>
                    )}

                    <button
                      onClick={() => setDeletingAssignment(ass)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all"
                      title="Delete assignment record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Single Assignment Delete Modal */}
      {deletingAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 text-slate-900 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Delete Assignment Record?</h3>
                <p className="text-xs text-slate-500">ID: {deletingAssignment.id}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              Are you sure you want to delete this test assignment record and all its question attempts?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingAssignment(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAssignment}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All History Modal */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 text-slate-900 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Clear Entire Test History?</h3>
                <p className="text-xs text-rose-600 font-semibold">Warning: Irreversible action</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              This will erase all historical test assignments, question attempts, and session runs across all learners.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearAllModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAllHistory}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
              >
                Clear All History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
