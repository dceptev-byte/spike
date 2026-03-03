'use client';

import { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  Calendar,
  MessageSquare,
  CheckSquare2,
  ChevronRight,
} from 'lucide-react';
import clsx from 'clsx';
import type { Task, Priority, TaskStatus } from '@/types';
import { MOCK_USERS } from '@/lib/mockData';
import { PRIORITY_LEVELS, DEFAULT_COLUMNS, STATUS_COLUMNS } from '@/constants';
import { useTaskStore } from '@/lib/store/taskStore';
import UserAvatar from '@/components/shared/UserAvatar';

// ---------------------------------------------------------------------------
// Priority button styles
// ---------------------------------------------------------------------------

const PRIORITY_IDLE: Record<Priority, string> = {
  low: 'bg-gray-100 text-gray-500 hover:bg-gray-200',
  medium: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
  high: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
  urgent: 'bg-red-50 text-red-600 hover:bg-red-100',
};

const PRIORITY_ACTIVE: Record<Priority, string> = {
  low: 'bg-gray-200 text-gray-800 ring-2 ring-gray-400',
  medium: 'bg-blue-100 text-blue-800 ring-2 ring-blue-500',
  high: 'bg-orange-100 text-orange-800 ring-2 ring-orange-500',
  urgent: 'bg-red-100 text-red-800 ring-2 ring-red-500',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCommentDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const CURRENT_USER = MOCK_USERS[0]; // Alex Morgan

// ---------------------------------------------------------------------------
// TaskDetailPanel
// ---------------------------------------------------------------------------

interface TaskDetailPanelProps {
  task: Task | null;
  onClose: () => void;
}

export default function TaskDetailPanel({
  task,
  onClose,
}: TaskDetailPanelProps) {
  const { updateTask, addSubtask, toggleSubtask, addComment } = useTaskStore();

  // Local state for text fields (avoids re-rendering the store on every keystroke)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [showSubtaskInput, setShowSubtaskInput] = useState(false);
  const [commentBody, setCommentBody] = useState('');
  const subtaskInputRef = useRef<HTMLInputElement>(null);

  // Sync local text state whenever a different task is opened
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? '');
      setNewSubtask('');
      setShowSubtaskInput(false);
      setCommentBody('');
    }
  }, [task?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus subtask input when it appears
  useEffect(() => {
    if (showSubtaskInput) subtaskInputRef.current?.focus();
  }, [showSubtaskInput]);

  // ── Field save handlers ──────────────────────────────────────────────────

  function saveTitle() {
    if (!task) return;
    const trimmed = title.trim();
    if (trimmed && trimmed !== task.title) updateTask(task.id, { title: trimmed });
  }

  function saveDescription() {
    if (!task) return;
    if (description !== (task.description ?? '')) {
      updateTask(task.id, { description });
    }
  }

  function handlePriority(priority: Priority) {
    if (task) updateTask(task.id, { priority });
  }

  function handleAssignee(e: React.ChangeEvent<HTMLSelectElement>) {
    if (task) updateTask(task.id, { assigneeId: e.target.value || undefined });
  }

  function handleStatus(e: React.ChangeEvent<HTMLSelectElement>) {
    if (task) updateTask(task.id, { status: e.target.value as TaskStatus });
  }

  function handleDueDate(e: React.ChangeEvent<HTMLInputElement>) {
    if (task) updateTask(task.id, { dueDate: e.target.value || undefined });
  }

  // ── Subtask handlers ─────────────────────────────────────────────────────

  function commitSubtask() {
    if (!task || !newSubtask.trim()) return;
    addSubtask(task.id, {
      id: `sub-${Date.now()}`,
      title: newSubtask.trim(),
      completed: false,
    });
    setNewSubtask('');
    setShowSubtaskInput(false);
  }

  function handleSubtaskKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commitSubtask();
    if (e.key === 'Escape') {
      setShowSubtaskInput(false);
      setNewSubtask('');
    }
  }

  // ── Comment handler ──────────────────────────────────────────────────────

  function submitComment() {
    if (!task || !commentBody.trim()) return;
    addComment(task.id, {
      id: `cmt-${Date.now()}`,
      taskId: task.id,
      authorId: CURRENT_USER.id,
      body: commentBody.trim(),
      createdAt: new Date().toISOString(),
    });
    setCommentBody('');
  }

  // ── Render ───────────────────────────────────────────────────────────────

  const isOpen = task !== null;
  const assignee = task ? MOCK_USERS.find((u) => u.id === task.assigneeId) : null;
  const doneCount = task ? task.subtasks.filter((s) => s.completed).length : 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 bg-black/25 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Task details"
        className={clsx(
          'fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl z-50',
          'flex flex-col transform transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {task ? (
          <>
            {/* ── Panel header ── */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2 text-xs text-gray-400 min-w-0">
                <span className="font-mono truncate">{task.id}</span>
                {task.labels.length > 0 && (
                  <>
                    <ChevronRight className="w-3 h-3 flex-shrink-0" />
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-500 truncate">
                      {task.labels.join(', ')}
                    </span>
                  </>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Scrollable body ── */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">

              {/* Title */}
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={saveTitle}
                rows={2}
                placeholder="Task title"
                className="w-full text-xl font-semibold text-gray-900 resize-none border-none outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-1 py-1 -mx-1 leading-snug placeholder-gray-300"
              />

              {/* Metadata grid */}
              <div className="grid grid-cols-[100px_1fr] gap-x-3 gap-y-3 text-sm">
                {/* Status */}
                <label className="text-gray-400 text-xs font-medium uppercase tracking-wide flex items-center">
                  Status
                </label>
                <select
                  value={task.status}
                  onChange={handleStatus}
                  className="text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DEFAULT_COLUMNS.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_COLUMNS[s].label}
                    </option>
                  ))}
                </select>

                {/* Assignee */}
                <label className="text-gray-400 text-xs font-medium uppercase tracking-wide flex items-center">
                  Assignee
                </label>
                <div className="flex items-center gap-2">
                  {assignee && <UserAvatar name={assignee.name} size="xs" />}
                  <select
                    value={task.assigneeId ?? ''}
                    onChange={handleAssignee}
                    className="flex-1 text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Unassigned</option>
                    {MOCK_USERS.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Due date */}
                <label className="text-gray-400 text-xs font-medium uppercase tracking-wide flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Due
                </label>
                <input
                  type="date"
                  value={task.dueDate ?? ''}
                  onChange={handleDueDate}
                  className="text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Priority selector */}
              <div>
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                  Priority
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(Object.keys(PRIORITY_LEVELS) as Priority[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePriority(p)}
                      className={clsx(
                        'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                        task.priority === p
                          ? PRIORITY_ACTIVE[p]
                          : PRIORITY_IDLE[p],
                      )}
                    >
                      {PRIORITY_LEVELS[p].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                  Description
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={saveDescription}
                  rows={4}
                  placeholder="Add a description…"
                  className="w-full text-sm text-gray-700 resize-none border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-300"
                />
              </div>

              {/* ── Subtasks ── */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                    <CheckSquare2 className="w-3.5 h-3.5" />
                    Subtasks
                    {task.subtasks.length > 0 && (
                      <span className="normal-case font-normal text-gray-400">
                        ({doneCount}/{task.subtasks.length})
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setShowSubtaskInput(true)}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </button>
                </div>

                {task.subtasks.length > 0 && (
                  <div className="space-y-1 mb-2">
                    {task.subtasks.map((sub) => (
                      <label
                        key={sub.id}
                        className="flex items-start gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={sub.completed}
                          onChange={() => toggleSubtask(task.id, sub.id)}
                          className="mt-0.5 w-3.5 h-3.5 rounded text-blue-600 cursor-pointer flex-shrink-0"
                        />
                        <span
                          className={clsx(
                            'text-sm flex-1 leading-snug',
                            sub.completed
                              ? 'line-through text-gray-400'
                              : 'text-gray-700',
                          )}
                        >
                          {sub.title}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {showSubtaskInput && (
                  <div className="flex gap-2">
                    <input
                      ref={subtaskInputRef}
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      onKeyDown={handleSubtaskKeyDown}
                      placeholder="Subtask title…"
                      className="flex-1 text-sm border border-blue-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={commitSubtask}
                      className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>

              {/* ── Comments / Activity ── */}
              <div>
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center gap-1.5 mb-4">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Comments
                </div>

                {task.comments.length > 0 && (
                  <div className="space-y-4 mb-4">
                    {task.comments.map((comment) => {
                      const author = MOCK_USERS.find(
                        (u) => u.id === comment.authorId,
                      );
                      return (
                        <div key={comment.id} className="flex gap-2.5">
                          {author && (
                            <UserAvatar name={author.name} size="sm" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="text-xs font-semibold text-gray-700">
                                {author?.name ?? 'Unknown'}
                              </span>
                              <span className="text-[11px] text-gray-400">
                                {formatCommentDate(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2 leading-relaxed">
                              {comment.body}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* New comment input */}
                <div className="flex gap-2.5">
                  <UserAvatar name={CURRENT_USER.name} size="sm" />
                  <div className="flex-1">
                    <textarea
                      value={commentBody}
                      onChange={(e) => setCommentBody(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                          submitComment();
                        }
                      }}
                      placeholder="Add a comment… (⌘↵ to send)"
                      rows={2}
                      className="w-full text-sm border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-300 resize-none"
                    />
                    {commentBody.trim() && (
                      <button
                        onClick={submitComment}
                        className="mt-1.5 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Comment
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom padding so the last element isn't flush with viewport edge */}
              <div className="h-8" />
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
