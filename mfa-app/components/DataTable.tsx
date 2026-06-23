'use client';

import Link from 'next/link';

type Column<T> = {
  key: keyof T & string;
  label: string;
};

type Props<T extends { id: string }> = {
  data: T[];
  columns: Column<T>[];
  basePath: string;
  onDelete: (id: string) => void;
};

export default function DataTable<T extends { id: string }>({
  data,
  columns,
  basePath,
  onDelete,
}: Props<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 border-b border-slate-800">
            {columns.map((col) => (
              <th key={col.key} className="p-2">
                {col.label}
              </th>
            ))}
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b border-slate-800">
              {columns.map((col) => (
                <td key={col.key} className="p-2">
                  {String(row[col.key])}
                </td>
              ))}

              <td className="p-2 flex gap-3">
                <Link
                  href={`${basePath}/${row.id}`}
                  className="text-blue-400"
                >
                  View
                </Link>

                <Link
                  href={`${basePath}/${row.id}/edit`}
                  className="text-yellow-400"
                >
                  Edit
                </Link>

                <button
                  onClick={() => onDelete(row.id)}
                  className="text-red-400"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}