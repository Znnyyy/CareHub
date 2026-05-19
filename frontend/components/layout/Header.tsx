"use client";

import { getUser } from "@/lib/auth";
import { useEffect, useState } from "react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title = "Dashboard", subtitle }: HeaderProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);
  
  const displaySubtitle = subtitle || new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="px-8 py-5 flex justify-between items-center sticky top-0 z-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          {displaySubtitle}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-md font-semibold text-slate-900">Halo, {user?.username}!</p>
          <p className="text-sm text-slate-500 capitalize">{user?.role}</p>
        </div>
      </div>
    </header>
  );
}
