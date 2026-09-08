import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nirvana-mep-api-ffa0h4hsbtdkeucv.southeastasia-01.azurewebsites.net';

const PhotoDocumentation = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
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
      console.log(' Fetching photos from:', `${API_BASE_URL}/api/photo-documentation`);
      const response = await axios.get(`${API_BASE_URL}/api/photo-documentation`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Photos response:', response.data);
      setPhotos(response.data.data || []);
    } catch (error) {
      console.error('❌ Error fetching photos:', error);
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
      // Kompresi foto sebelum convert ke base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          // Resize image untuk mengurangi ukuran base64
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert ke base64 dengan kualitas 0.7
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          
          console.log('📷 Original size:', file.size, 'bytes');
          console.log('📷 Compressed base64 length:', compressedBase64.length);
          
          setPreview(compressedBase64);
          setFormData(prev => ({ ...prev, photo_url: compressedBase64 }));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      console.log(' Sending Photo data:', {
        ...formData,
        photo_url: formData.photo_url ? `${formData.photo_url.substring(0, 50)}...` : 'empty'
      });

      const response = await axios.post(
        `${API_BASE_URL}/api/photo-documentation`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          maxContentLength: 10 * 1024 * 1024, // 10MB
          maxBodyLength: 10 * 1024 * 1024 // 10MB
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
      console.error('❌ Photo Error:', error);
      console.error('Response:', error.response?.data);
      toast.error('Gagal upload foto: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
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
              <input 
                type="date" 
                name="reading_date" 
                value={formData.reading_date} 
                onChange={handleChange} 
                className="w-full border rounded px-3 py-2" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lokasi</label>
              <input 
                type="text" 
                name="location" 
                value={formData.location} 
                onChange={handleChange} 
                placeholder="B2, B1, PH, Rooftop" 
                className="w-full border rounded px-3 py-2" 
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              className="w-full border rounded px-3 py-2"
            >
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
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows="3" 
              className="w-full border rounded px-3 py-2" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Upload Foto</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="w-full border rounded px-3 py-2" 
            />
            {preview && (
              <div className="mt-2">
                <img src={preview} alt="Preview" className="max-w-xs rounded border" />
                <p className="text-xs text-gray-500 mt-1">
                  Ukuran: {(preview.length / 1024).toFixed(2)} KB (base64)
                </p>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={saving || !formData.photo_url}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : 'Simpan Foto'}
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
              {photo.photo_url && (
                <img 
                  src={photo.photo_url} 
                  alt={photo.description} 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div className="p-4">
                <p className="text-sm font-semibold">{photo.location}</p>
                <p className="text-xs text-gray-500">{new Date(photo.reading_date).toLocaleDateString('id-ID')}</p>
                <p className="text-sm mt-2">{photo.description}</p>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
                  {photo.category}
                </span>
                <br />
                <button 
                  onClick={() => handleDelete(photo.id)} 
                  className="mt-2 text-red-600 text-sm hover:text-red-800"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PhotoDocumentation;