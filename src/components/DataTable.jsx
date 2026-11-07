export default function DataTable({ columns, data, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white/[0.02] backdrop-blur-[30px] rounded-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3b82f6]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.02] backdrop-blur-[30px] rounded-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.03] border-b border-white/[0.1]">
              {columns.map((col, index) => (
                <th key={index} className="px-6 py-4 text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-[#737373]">
                  No hay registros para mostrar.
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-white/[0.04] transition-colors">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 text-sm text-[#d4d4d4]">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}