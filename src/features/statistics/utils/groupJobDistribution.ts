import { JobDistribution } from "@/types/project";

export function groupJobDistribution(
    data: JobDistribution[]
): JobDistribution[] {
    const sorted = [...data].sort((a, b) => {
        if (b.value !== a.value) return b.value - a.value;
        return a.label.localeCompare(b.label);
    });

    if (sorted.length <= 6) return sorted;

    const top6 = sorted.slice(0, 6);
    const rest = sorted.slice(6);
    const otherValue = rest.reduce((sum, item) => sum + item.value, 0);

    return [...top6, { label: "Other", value: otherValue, color: "#D1D5DB" }];
}
