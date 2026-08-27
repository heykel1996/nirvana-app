import { useEffect, useState } from 'react';
import { lvmdpAPI } from '../services/api';
import toast from 'react-hot-toast';

const Lvmdp = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    shift_id: 1,
    user_id: 1,
    reading_date: new Date().toISOString().split('T')[0],
    reading_time: new Date().toTimeString().split(' ')[0],
    load_kw: '',
    cos_phi: '',
    voltage_r: '',
    voltage_s: '',
    voltage_t: '',
    current_r: '',
    current_s: '',
    current_t: '',
    frequency: 50,
    power_factor: '',
    status: 'normal',
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await lvmdpAPI.getAll();
      setData(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await lvmdpAPI.create(formData);
      toast.success('Data berhasil disimpan!');
      setShowForm(false);
      fetchData();
      setFormData({
        ...formData,
        load_kw: '',
        cos_phi: '',
        voltage_r: '',
        voltage_s: '',
        voltage_t: '',
        current_r: '',
        current_s: '',
        current_t: '',
        power_factor: '',
        notes: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Gagal menyimpan data');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">LVMDP Readings</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : '+ Add New'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Add New LVMDP Reading</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={formData.reading_date}
                onChange={(e) => setFormData({ ...formData, reading_date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                value={formData.reading_time}
                onChange={(e) => setFormData({ ...formData, reading_time: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Load (kW)</label>
              <input
                type="number"
                step="0.01"
                value={formData.load_kw}
                onChange={(e) => setFormData({ ...formData, load_kw: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Voltage R</label>
              <input
                type="number"
                step="0.01"
                value={formData.voltage_r}
                onChange={(e) => setFormData({ ...formData, voltage_r: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Voltage S</label>
              <input
                type="number"
                step="0.01"
                value={formData.voltage_s}
                onChange={(e) => setFormData({ ...formData, voltage_s: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Voltage T</label>
              <input
                type="number"
                step="0.01"
                value={formData.voltage_t}
                onChange={(e) => setFormData({ ...formData, voltage_t: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Current R</label>
              <input
                type="number"
                step="0.01"
                value={formData.current_r}
                onChange={(e) => setFormData({ ...formData, current_r: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Current S</label>
              <input
                type="number"
                step="0.01"
                value={formData.current_s}
                onChange={(e) => setFormData({ ...formData, current_s: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Current T</label>
              <input
                type="number"
                step="0.01"
                value={formData.current_t}
                onChange={(e) => setFormData({ ...formData, current_t: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Power Factor</label>
              <input
                type="number"
                step="0.01"
                value={formData.power_factor}
                onChange={(e) => setFormData({ ...formData, power_factor: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              >
                <option value="normal">Normal</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              />
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Load (kW)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voltage R/S/T</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current R/S/T</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PF</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.reading_date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.reading_time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.load_kw}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.voltage_r}/{item.voltage_s}/{item.voltage_t}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.current_r}/{item.current_s}/{item.current_t}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.power_factor}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.status === 'normal' ? 'bg-green-100 text-green-800' : 
                      item.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Lvmdp;