import { LucideIcon } from "lucide-react";

interface TableEmptyProps {
  colSpan: number;
  message?: string;
  icon: LucideIcon;
}

export function TableEmpty({
  colSpan,
  message = "Tidak ada data ditemukan.",
  icon: Icon,
}: TableEmptyProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-12 text-center text-slate-500">
        <div className="flex flex-col items-center justify-center gap-2">
          <Icon className="w-10 h-10 text-slate-300" />
          <p className="text-sm font-medium">{message}</p>
        </div>
      </td>
    </tr>
  );
}
