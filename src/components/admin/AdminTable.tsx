"use client";

import type { ReactNode } from "react";

export interface Column<T> {
  header: string;
  render: (row: T) => ReactNode;
}

export default function AdminTable<T>({ columns, rows, keyField, emptyMessage = "No records found." }: {
  columns: Column<T>[];
  rows: T[];
  keyField: (row: T) => string;
  emptyMessage?: string;
}) {
  if (rows.length === 0) {
    return <div className="rounded-2xl border border-brass/15 bg-white/[0.03] py-16 text-center text-sm text-parchment/50">{emptyMessage}</div>;
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-brass/15 bg-white/[0.03]">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead>
          <tr className="border-b border-brass/15 text-xs uppercase tracking-wider text-parchment/40">
            {columns.map((col) => (
              <th key={col.header} className="px-4 py-3 font-medium">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((row) => (
            <tr key={keyField(row)} className="transition-colors hover:bg-white/[0.02]">
              {columns.map((col) => (
                <td key={col.header} className="px-4 py-3 text-parchment/80">{col.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
