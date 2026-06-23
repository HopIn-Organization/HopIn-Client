export function StatisticsSkeleton() {
    return (
        <div className="space-y-6">
            {/* Top row: 2 metric cards */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <SkeletonCard className="h-40" />
                <SkeletonCard className="h-40" />
            </div>

            {/* Bottom section: 3 chart cards */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <SkeletonCard className="h-72" />
                <SkeletonCard className="h-72" />
                <SkeletonCard className="h-72" />
            </div>
        </div>
    );
}

function SkeletonCard({ className = "" }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-2xl border border-border bg-surface-muted ${className}`}
        />
    );
}
