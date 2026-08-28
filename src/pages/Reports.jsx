import { useState } from 'react';

const Reports = () => {
  const [reportType, setReportType] = useState('daily');
  const [dateFrom, setDateFrom] = useState(new Date().toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);

  const handleExport = (format) => {
    alert(`Export ${reportType} report from ${dateFrom} to ${dateTo} in ${format.toUpperCase()} format.\n\nFitur ini akan diimplementasikan dengan library seperti jspdf atau xlsx.`);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Export</h1>
        <p className="text-gray-600 mt-1">Generate and export operational reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Report Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full rounded-lg border-gray-300 border p-2.5">
                <option value="daily">Daily Report</option>
                <option value="weekly">Weekly Report</option>
                <option value="monthly">Monthly Report</option>
                <option value="lvmdp">LVMDP Report</option>
                <option value="stp">STP Report</option>
                <option value="water">Water Levels Report</option>
                <option value="elektrikal">Elektrikal PLN Report</option>
                <option value="check_sheets">Check Sheets Report</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full rounded-lg border-gray-300 border p-2.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full rounded-lg border-gray-300 border p-2.5" />
            </div>
            <div className="pt-4 space-y-2">
              <button onClick={() => handleExport('pdf')} className="w-full bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 font-medium shadow-lg flex items-center justify-center gap-2">
                📄 Export PDF
              </button>
              <button onClick={() => handleExport('excel')} className="w-full bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 font-medium shadow-lg flex items-center justify-center gap-2">
                📊 Export Excel
              </button>
              <button onClick={() => handleExport('csv')} className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 font-medium shadow-lg flex items-center justify-center gap-2">
                📋 Export CSV
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white shadow-lg rounded-2xl border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Available Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Daily Operations', icon: '📅', desc: 'Summary of daily operations' },
              { name: 'LVMDP Readings', icon: '⚡', desc: 'Electrical readings report' },
              { name: 'STP Operations', icon: '', desc: 'Sewage treatment report' },
              { name: 'Water Levels', icon: '💧', desc: 'Tank water levels report' },
              { name: 'Elektrikal PLN', icon: '💡', desc: 'PLN electricity report' },
              { name: 'Check Sheets', icon: '✅', desc: 'Equipment inspection report' },
              { name: 'Shift Handover', icon: '🔄', desc: 'Shift change documentation' },
              { name: 'Photo Documentation', icon: '📷', desc: 'Photo records report' },
            ].map((report, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{report.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{report.name}</h3>
                    <p className="text-sm text-gray-600">{report.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Pilih tipe report dan rentang tanggal</li>
              <li>• Klik tombol export untuk download</li>
              <li>• PDF untuk laporan formal</li>
              <li>• Excel untuk analisis data</li>
              <li>• CSV untuk import ke sistem lain</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;