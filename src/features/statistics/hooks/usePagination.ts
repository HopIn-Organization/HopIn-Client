import { useState, useMemo } from "react";

const DEFAULT_PAGE_SIZE = 8;

export function usePagination<T>(items: T[], pageSize = DEFAULT_PAGE_SIZE) {
    const [page, setPage] = useState(0);
    const [prevItemsLength, setPrevItemsLength] = useState(items.length);

    // Reset page when items change (e.g., filters applied, new data loaded)
    if (items.length !== prevItemsLength) {
        setPrevItemsLength(items.length);
        setPage(0);
    }

    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

    // Clamp page if it becomes out of bounds (e.g., items shrink)
    const safePage = Math.min(page, totalPages - 1);

    const pageItems = useMemo(
        () => items.slice(safePage * pageSize, (safePage + 1) * pageSize),
        [items, safePage, pageSize],
    );

    return {
        pageItems,
        currentPage: safePage,
        totalPages,
        canGoBack: safePage > 0,
        canGoForward: safePage < totalPages - 1,
        goNext: () => setPage((p) => Math.min(p + 1, totalPages - 1)),
        goPrev: () => setPage((p) => Math.max(p - 1, 0)),
    };
}
