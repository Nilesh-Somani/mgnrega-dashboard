import { useTranslation } from 'react-i18next';
import { normalizeKey } from '../utils/labelFormatter';
import { useState } from 'react';

const DataTable = ({ data }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [sortCol, setSortCol] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  if (!Array.isArray(data) || data.length === 0) return null;

  const columns = Object.keys(data[0]);

  const filtered = data.filter(row =>
    Object.values(row).some(val =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortCol) return 0;
    const valA = a[sortCol];
    const valB = b[sortCol];
    return sortAsc
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const shouldScroll = data.length > 10;

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder={t("Search in table")}
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full p-2 border rounded shadow-sm"
      />
      <div className={`${shouldScroll ? 'overflow-auto max-h-[400px]' : 'overflow-y-hidden'} border rounded-lg shadow text-sm`} >
        <table className="min-w-full text-left">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              {columns.map((col, i) => {
                const normalized = normalizeKey(col);
                const translated = t(normalized);
                return (
                  <th
                    key={i}
                    className="px-3 py-2 cursor-pointer whitespace-nowrap font-semibold border-b"
                    onClick={() => {
                      setSortCol(col);
                      setSortAsc(col === sortCol ? !sortAsc : true);
                    }}
                  >
                    {translated === normalized ? normalized : translated}
                    {sortCol === col && (sortAsc ? ' ▲' : ' ▼')}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr
                key={i}
                className="border-t even:bg-gray-50 hover:bg-blue-50 transition-colors duration-150"
              >
                {columns.map((col, j) => (
                  <td key={j} className="px-3 py-2 whitespace-nowrap">{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div >
  );
};

export default DataTable;