import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nirvana-mep-api-ffa0h4hsbtdkeucv.southeastasia-01.azurewebsites.net';

const PhotoDocumentation = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reading_date: new Date().toISOString().split('T')[0],
    location: '', category: 'General', description: '', photo_url: ''
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/photo-documentation`, { headers: { Authorization: `Bearer ${token}` } });
      setData(res.data.data || []);
    } catch (error) { toast.error('Gagal memuat foto'); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/photo-documentation`, formData, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Foto berhasil diupload!');
      setShowForm(false);
      setFormData({ reading_date: new Date().toISOString().split('T')[0], location: '', category: 'General', description: '', photo_url: '' });
      fetchData();
    } catch (error) { toast.error('Gagal upload foto'); }
  };

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Photo Documentation</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          {showForm ? 'Batal' : '+ Upload Foto'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Tanggal</label><input type="date" value={formData.reading_date} onChange={(e) => handleChange('reading_date', e.target.value)} className="w-full border rounded p-2" required /></div>
              <div><label className="block text-sm font-medium mb-1">Lokasi</label><input type="text" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} className="w-full border rounded p-2" required /></div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kategori</label>
              <select value={formData.category} onChange={(e) => handleChange('category', e.target.value)} className="w-full border rounded p-2">
                <option value="General">General</option>
                <option value="Kerusakan">Kerusakan</option>
                <option value="Perbaikan">Perbaikan</option>
                <option value="Peralatan">Peralatan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Deskripsi</label>
              <textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} className="w-full border rounded p-2" rows="2"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Upload Foto</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border rounded p-2" required />
              {formData.photo_url && <img src={formData.photo_url} alt="Preview" className="mt-2 h-32 rounded border" />}
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Simpan Foto</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
            <img src={item.photo_url} alt={item.location} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-bold">{item.location}</h3>
              <p className="text-xs text-gray-500">{item.reading_date} - {item.category}</p>
              <p className="text-sm mt-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoDocumentation;