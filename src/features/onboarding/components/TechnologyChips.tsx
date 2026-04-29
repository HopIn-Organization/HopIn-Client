interface TechnologyChipsProps {
  items: string[];
  onRemove?: (item: string) => void;
}

export function TechnologyChips({ items, onRemove }: TechnologyChipsProps) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {items?.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onRemove?.(item)}
          className="flex items-center gap-2 rounded-full bg-[#DDF7F4] px-3 py-1 text-xs font-medium text-[#149E90] hover:bg-[#C3F0EB] transition-colors"
        >
          {item}
          {onRemove && <span>×</span>}
        </button>
      ))}
    </div>
  );
}
