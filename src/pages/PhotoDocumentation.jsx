import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'https://nirvana-mep-api-ffa0h4hsbtdkeucv.southeastasia-01.azurewebsites.net';

const PhotoDocumentation = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reading_date: new Date().toISOString().split('T')[0],
    location: '',
    category: 'General',
    description: '',
    photo_url: ''
  });
  const [preview, setPreview] = useState(null);

  const fetchPhotos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/photo-documentation`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPhotos(response.data.data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
      toast.error('Gagal memuat foto');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setFormData(prev => ({ ...prev, photo_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log(' Sending Photo data:', formData);

      const response = await axios.post(
        `${API_BASE_URL}/api/photo-documentation`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Photo Response:', response.data);

      if (response.data && response.data.success) {
        toast.success('Foto berhasil diupload!');
        setShowForm(false);
        setPreview(null);
        fetchPhotos();
        setFormData({
          reading_date: new Date().toISOString().split('T')[0],
          location: '',
          category: 'General',
          description: '',
          photo_url: ''
        });
      } else {
        toast.error('Gagal upload foto');
      }
    } catch (error) {
      console.error(' Photo Error:', error);
      toast.error('Gagal upload foto: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus foto ini?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/photo-documentation/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Foto dihapus');
      fetchPhotos();
    } catch (error) {
      toast.error('Gagal menghapus');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Photo Documentation</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Tutup Form' : '+ Upload Foto'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4">
          <h2 className="text-xl font-semibold">Upload Foto Dokumentasi</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tanggal</label>
              <input type="date" name="reading_date" value={formData.reading_date} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lokasi</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="B2, B1, PH, Rooftop" className="w-full border rounded px-3 py-2" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full border rounded px-3 py-2">
              <option value="General">General</option>
              <option value="Electrical">Electrical</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Fire Safety">Fire Safety</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Upload Foto</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border rounded px-3 py-2" />
            {preview && <img src={preview} alt="Preview" className="mt-2 max-w-xs rounded" />}
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
            Simpan Foto
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-center col-span-3">Loading...</p>
        ) : photos.length === 0 ? (
          <p className="text-center col-span-3 text-gray-500">Belum ada foto</p>
        ) : (
          photos.map(photo => (
            <div key={photo.id} className="bg-white rounded-lg shadow overflow-hidden">
              {photo.photo_url && <img src={photo.photo_url} alt={photo.description} className="w-full h-48 object-cover" />}
              <div className="p-4">
                <p className="text-sm font-semibold">{photo.location}</p>
                <p className="text-xs text-gray-500">{new Date(photo.reading_date).toLocaleDateString('id-ID')}</p>
                <p className="text-sm mt-2">{photo.description}</p>
                <button onClick={() => handleDelete(photo.id)} className="mt-2 text-red-600 text-sm hover:text-red-800">Hapus</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PhotoDocumentation;