'use client';

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-64 bg-muted rounded animate-pulse" />
          <div className="h-4 w-48 bg-muted rounded mt-2 animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="h-[140px] rounded-xl bg-gradient-to-br from-muted/50 to-muted animate-pulse"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[400px] rounded-xl bg-gradient-to-br from-muted/50 to-muted animate-pulse" />
        <div className="h-[400px] rounded-xl bg-gradient-to-br from-muted/50 to-muted animate-pulse" />
      </div>
    </div>
  );
}