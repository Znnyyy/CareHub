interface TableLoadingProps {
  colSpan: number;
  message?: string;
  color?: "blue" | "emerald" | "indigo";
}

export function TableLoading({
  colSpan,
  message = "Memuat data...",
  color = "blue",
}: TableLoadingProps) {
  const spinnerClasses = {
    blue: "border-blue-600",
    emerald: "border-emerald-600",
    indigo: "border-indigo-600",
  };

  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-12 text-center text-slate-500">
        <div className="flex flex-col items-center justify-center gap-2">
          <div
            className={`w-6 h-6 border-2 border-t-transparent rounded-full animate-spin ${spinnerClasses[color]}`}
          ></div>
          <p className="text-sm font-medium">{message}</p>
        </div>
      </td>
    </tr>
  );
}
