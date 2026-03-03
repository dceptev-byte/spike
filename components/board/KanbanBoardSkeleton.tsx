// ---------------------------------------------------------------------------
// Skeleton primitives
// ---------------------------------------------------------------------------

function Bone({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className}`} />;
}

// ---------------------------------------------------------------------------
// Single task card skeleton
// ---------------------------------------------------------------------------

function TaskCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3.5 space-y-2.5">
      {/* Title lines */}
      <Bone className="h-3.5 w-5/6" />
      <Bone className="h-3 w-3/5" />
      {/* Priority + avatar row */}
      <div className="flex items-center justify-between pt-0.5">
        <Bone className="h-5 w-14 rounded-full" />
        <Bone className="h-6 w-6 rounded-full" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single column skeleton
// ---------------------------------------------------------------------------

function ColumnSkeleton({ taskCount }: { taskCount: number }) {
  return (
    <div className="flex-shrink-0 w-[280px] bg-gray-50 rounded-2xl p-3">
      {/* Column header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <Bone className="h-2.5 w-2.5 rounded-full" />
          <Bone className="h-4 w-20" />
          <Bone className="h-5 w-5 rounded-full" />
        </div>
        <Bone className="h-6 w-6 rounded-lg" />
      </div>

      {/* Task card stack */}
      <div className="space-y-2.5">
        {Array.from({ length: taskCount }).map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Full board skeleton — 4 columns matching DEFAULT_COLUMNS
// ---------------------------------------------------------------------------

const COLUMN_COUNTS = [3, 2, 2, 1]; // Backlog, In Progress, Review, Done

export default function KanbanBoardSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto h-full items-start pb-4">
      {COLUMN_COUNTS.map((count, i) => (
        <ColumnSkeleton key={i} taskCount={count} />
      ))}
    </div>
  );
}
