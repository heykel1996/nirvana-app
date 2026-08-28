import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:3000';

const PhotoDocumentation = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    reading_date: new Date().toISOString().split('T')[0],
    location: '',
    description: '',
    photo_url: '', // Akan berisi Base64 string
    category: 'General'
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/photo-documentation`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data.data || []);
    } catch (error) { toast.error('Failed to fetch photos'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus foto ini?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/photo-documentation/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Foto berhasil dihapus!');
      fetchData();
    } catch (error) { toast.error('Gagal menghapus foto'); }
  };

  // Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  // Handle Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    } else {
      toast.error('Hanya file gambar yang diperbolehkan!');
    }
  };

  const processFile = (file) => {
    if (file.size > 5 * 1024 * 1024) { // Max 5MB
      toast.error('Ukuran file maksimal 5MB!');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setFormData({ ...formData, photo_url: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPreview(null);
    setFormData({ ...formData, photo_url: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.photo_url) {
      toast.error('Silakan upload foto terlebih dahulu!');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/photo-documentation`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Foto berhasil disimpan!');
      setShowForm(false);
      removePhoto();
      setFormData({
        reading_date: new Date().toISOString().split('T')[0],
        location: '',
        description: '',
        photo_url: '',
        category: 'General'
      });
      fetchData();
    } catch (error) { toast.error('Gagal menyimpan foto'); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Photo Documentation</h1>
          <p className="text-gray-600 mt-1">Dokumentasi Foto Lapangan</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg font-medium"
        >
          {showForm ? '✕ Cancel' : '+ Upload Photo'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Upload New Photo</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                <input type="date" value={formData.reading_date} onChange={(e) => setFormData({ ...formData, reading_date: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5">
                  <option value="General">General</option>
                  <option value="LVMDP">LVMDP</option>
                  <option value="STP">STP</option>
                  <option value="Genset">Genset</option>
                  <option value="Pompa">Pompa</option>
                  <option value="Elevator">Elevator</option>
                  <option value="Kerusakan">Kerusakan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" placeholder="Contoh: Basement 1" required />
              </div>
            </div>

            {/* Drag & Drop Upload Area */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Foto</label>
              
              {!preview ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-600 font-medium">
                      <span className="text-blue-600">Klik untuk upload</span> atau drag & drop foto di sini
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG (Maks. 5MB)</p>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-gray-200">
                  <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border-gray-300 border p-2.5" rows="2" placeholder="Deskripsi kondisi foto..." />
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium shadow-lg">
              Save Photo Documentation
            </button>
          </form>
        </div>
      )}

      {/* Photo Gallery Grid */}
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Photo Gallery</h3>
        {data.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Belum ada foto dokumentasi.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.map((item) => (
              <div key={item.id} className="group relative bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                <img 
                  src={item.photo_url} 
                  alt={item.description} 
                  className="w-full h-48 object-cover"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                />
                <div className="p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-500">{item.reading_date}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">{item.location}</p>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoDocumentation;