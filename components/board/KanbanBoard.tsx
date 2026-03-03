'use client';

import { useState, useRef } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import type { Project, Task, TaskStatus } from '@/types';
import { DEFAULT_COLUMNS } from '@/constants';
import { useTaskStore } from '@/lib/store/taskStore';
import KanbanColumn from './KanbanColumn';
import { TaskCardContent } from './TaskCard';
import TaskDetailPanel from './TaskDetailPanel';

const COLUMN_SET = new Set<string>(DEFAULT_COLUMNS);

interface KanbanBoardProps {
  project: Project;
}

export default function KanbanBoard({ project }: KanbanBoardProps) {
  const { tasks, setTasks, addTask, moveTask, reorderTasks } = useTaskStore();

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  // Track which task detail panel is open by ID so the panel always reflects
  // the latest store data (avoids stale-closure issues with a stored object).
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Snapshot of all tasks taken at drag-start; used to revert on cancel.
  const snapshotRef = useRef<Task[] | null>(null);

  // Only tasks that belong to this project
  const projectTasks = tasks.filter((t) => t.projectId === project.id);

  const selectedTask =
    projectTasks.find((t) => t.id === selectedTaskId) ?? null;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require 8 px of movement before a drag starts, so a tap opens the panel
      activationConstraint: { distance: 8 },
    }),
  );

  // Return tasks for a given column, sorted by their order field
  function getColumnTasks(status: TaskStatus): Task[] {
    return projectTasks
      .filter((t) => t.status === status)
      .sort((a, b) => a.order - b.order);
  }

  const activeTask = activeId
    ? projectTasks.find((t) => t.id === activeId) ?? null
    : null;

  // ── Drag handlers ────────────────────────────────────────────────────────

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id);
    snapshotRef.current = [...tasks]; // shallow copy — enough to restore
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const isOverColumn = COLUMN_SET.has(overId);

    const currentTask = projectTasks.find((t) => t.id === activeId);
    if (!currentTask) return;

    const targetStatus: TaskStatus | undefined = isOverColumn
      ? (overId as TaskStatus)
      : (projectTasks.find((t) => t.id === overId)?.status as TaskStatus | undefined);

    // Only act on cross-column hovers
    if (!targetStatus || targetStatus === currentTask.status) return;

    moveTask(activeId, targetStatus);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    snapshotRef.current = null;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // If dropped on a column header — moveTask already ran in onDragOver
    if (COLUMN_SET.has(overId)) return;

    // Within-column reorder: both IDs are task IDs
    if (activeId === overId) return;

    const activeTask = projectTasks.find((t) => t.id === activeId);
    const overTask = projectTasks.find((t) => t.id === overId);

    if (!activeTask || !overTask) return;
    if (activeTask.status !== overTask.status) return; // cross-column already handled

    const colTasks = getColumnTasks(activeTask.status);
    const oldIndex = colTasks.findIndex((t) => t.id === activeId);
    const newIndex = colTasks.findIndex((t) => t.id === overId);

    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      const reordered = arrayMove(colTasks, oldIndex, newIndex);
      reorderTasks(
        project.id,
        activeTask.status,
        reordered.map((t) => t.id),
      );
    }
  }

  function handleDragCancel() {
    setActiveId(null);
    if (snapshotRef.current) {
      setTasks(snapshotRef.current);
      snapshotRef.current = null;
    }
  }

  // ── Quick-add task ────────────────────────────────────────────────────────

  function handleAddTask(status: TaskStatus) {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      projectId: project.id,
      title: 'New task',
      status,
      priority: 'medium',
      subtasks: [],
      comments: [],
      labels: [],
      order: getColumnTasks(status).length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addTask(newTask);
    setSelectedTaskId(newTask.id);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="h-full flex flex-col">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {/* Board columns */}
        <div className="flex gap-4 overflow-x-auto flex-1 min-h-0 pb-4 items-start">
          {DEFAULT_COLUMNS.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={getColumnTasks(status)}
              onTaskClick={(task) => setSelectedTaskId(task.id)}
              onAddTask={handleAddTask}
            />
          ))}
        </div>

        {/* Drag ghost */}
        <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
          {activeTask ? (
            <TaskCardContent
              task={activeTask}
              onClick={() => {}}
              isDragOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task detail panel (fixed, outside flow) */}
      <TaskDetailPanel
        task={selectedTask}
        onClose={() => setSelectedTaskId(null)}
      />
    </div>
  );
}
