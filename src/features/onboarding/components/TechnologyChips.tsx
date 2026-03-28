interface TechnologyChipsProps {
  items: string[];
}

export function TechnologyChips({ items }: TechnologyChipsProps) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="rounded-full bg-[#DDF7F4] px-3 py-1 text-xs font-medium text-[#149E90]">
          {item}
        </span>
      ))}
    </div>
  );
}
