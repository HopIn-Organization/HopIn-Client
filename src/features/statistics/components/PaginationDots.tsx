import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationDotsProps {
    currentPage: number;
    totalPages: number;
    onPrevious: () => void;
    onNext: () => void;
}

export function PaginationDots({ currentPage, totalPages, onPrevious, onNext }: PaginationDotsProps) {
    const isFirstPage = currentPage === 0;
    const isLastPage = currentPage >= totalPages - 1;

    return (
        <div className="flex items-center justify-center gap-3 pt-3">
            <button
                type="button"
                onClick={onPrevious}
                disabled={isFirstPage}
                aria-label="Previous page"
                aria-disabled={isFirstPage}
                className={`grid h-7 w-7 place-items-center rounded-full transition-colors ${isFirstPage ? "cursor-default text-gray-300" : "text-text-secondary hover:bg-surface-muted"
                    }`}
            >
                <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => (
                    <span
                        key={i}
                        className={`block h-2 w-2 rounded-full transition-colors ${i === currentPage ? "bg-primary" : "bg-gray-300"
                            }`}
                        aria-label={`Page ${i + 1}${i === currentPage ? " (current)" : ""}`}
                    />
                ))}
            </div>

            <button
                type="button"
                onClick={onNext}
                disabled={isLastPage}
                aria-label="Next page"
                aria-disabled={isLastPage}
                className={`grid h-7 w-7 place-items-center rounded-full transition-colors ${isLastPage ? "cursor-default text-gray-300" : "text-text-secondary hover:bg-surface-muted"
                    }`}
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
}
