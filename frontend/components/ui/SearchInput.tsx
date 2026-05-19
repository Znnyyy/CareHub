import { Search } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  focusColor?: "blue" | "emerald" | "indigo";
}

export function SearchInput({
  placeholder = "Cari...",
  value,
  onChange,
  focusColor = "blue",
}: SearchInputProps) {
  const focusClasses = {
    blue: "focus:ring-blue-600/20 focus:border-blue-600",
    emerald: "focus:ring-emerald-600/20 focus:border-emerald-600",
    indigo: "focus:ring-indigo-600/20 focus:border-indigo-600",
  };

  return (
    <div className="relative w-full sm:max-w-xs">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="w-4 h-4 text-slate-400" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all shadow-sm ${focusClasses[focusColor]}`}
      />
    </div>
  );
}
