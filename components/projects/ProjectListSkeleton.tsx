// ---------------------------------------------------------------------------
// Skeleton primitives
// ---------------------------------------------------------------------------

function Bone({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className}`} />;
}

// ---------------------------------------------------------------------------
// Single card skeleton — matches ProjectCard layout
// ---------------------------------------------------------------------------

function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
      {/* Name + status badge row */}
      <div className="flex items-start justify-between gap-3">
        <Bone className="h-5 w-3/5" />
        <Bone className="h-5 w-16 rounded-full" />
      </div>

      {/* Description lines */}
      <div className="space-y-1.5">
        <Bone className="h-3.5 w-full" />
        <Bone className="h-3.5 w-4/5" />
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Bone className="h-3 w-16" />
          <Bone className="h-3 w-8" />
        </div>
        <Bone className="h-1.5 w-full rounded-full" />
      </div>

      {/* Footer: avatar stack + due date */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex -space-x-1.5">
          {[0, 1, 2].map((i) => (
            <Bone key={i} className="w-7 h-7 rounded-full ring-2 ring-white" />
          ))}
        </div>
        <Bone className="h-3 w-20" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exported skeleton — drop-in replacement for the project grid
// ---------------------------------------------------------------------------

export default function ProjectListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}
