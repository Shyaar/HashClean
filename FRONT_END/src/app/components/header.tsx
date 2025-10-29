"use client";

import { Search } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  showMenu?: boolean;
}

export function Header({
  title,
  showSearch = true,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white ">
      <div className="flex flex-col justify-between px-4 py-4">

        <div className="flex items-center gap-2 border-b pb-2 border-gray-400 mb-3">
          <Image
            src="/logo.png"
            alt="Novana"
            width={32}
            height={32}
            className="rounded"
          />
          <span className="font-semibold text-foreground">NOVANA</span>
        </div>

        <div className="flex items-center justify-between">
          {title && (
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
          )}
          <div className="bg-white p-2">
            {showSearch && <Search className="h-5 w-5 text-muted-foreground" />}
          </div>
        </div>
      </div>
    </header>
  );
}
