import React, { useState, useRef, useEffect } from "react";
import { Download } from "lucide-react";
import type { ExportFormat } from "../../types";
import clsx from "clsx";

interface ExportButtonProps {
  onExport: (format: ExportFormat) => void;
  disabled?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ onExport, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleExport = (format: ExportFormat) => {
    onExport(format);
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="p-1 hover:bg-waldorf-surface-bright rounded transition-colors disabled:opacity-40"
        title="Export data"
      >
        <Download size={14} className="text-waldorf-text-dim" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 bg-waldorf-surface border border-waldorf-border rounded-lg shadow-xl z-50 overflow-hidden min-w-[120px]">
          {(["json", "csv", "markdown"] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => handleExport(fmt)}
              className={clsx(
                "w-full text-left px-3 py-1.5 text-[11px] hover:bg-waldorf-surface-bright transition-colors",
                "flex items-center justify-between gap-4"
              )}
            >
              <span className="capitalize">{fmt}</span>
              <span className="text-[9px] text-waldorf-text-dim font-mono">
                {fmt === "json" ? ".json" : fmt === "csv" ? ".csv" : ".md"}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
