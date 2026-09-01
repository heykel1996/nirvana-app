import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://nirvana-mep-api-ffa0h4hsbtdkeucv.southeastasia-01.azurewebsites.net';

const CheckSheets = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Initial State untuk semua equipment
  const initialFormState = {
    reading_date: new Date().toISOString().split('T')[0],
    shift_id: 1,
    petugas: '',
    // Shift 1
    water_level_status: 'B', motor_eq1_status: 'B', motor_eq2_status: 'B',
    motor_boster1_status: 'B', motor_boster2_status: 'B', buzzer_status: 'B',
    screen_status: 'B', exhaust_fan_status: 'B', pressure_air_status: 'B',
    chiller_dosing_status: 'B', water_level_dosing_status: 'B',
    // Shift 2
    floor_light_status: 'B', facade_light_status: 'B', swimming_light_status: 'B',
    light_b1_status: 'B', light_b2_status: 'B', stairs_a_status: 'B',
    stairs_b_status: 'B', radiator_status: 'B', jockey_pump_status: 'B',
    hydrant_pump_status: 'B', hydrant_diesel_status: 'B',
    sumpit1_status: 'B', sumpit2_status: 'B', sumpit3_status: 'B', sumpit4_status: 'B',
    // Shift 3
    panel_genset_status: 'B', elevator1_status: 'B', elevator2_status: 'B',
    elevator3_status: 'B', elevator4_status: 'B', elevator5_status: 'B',
    pompa_del_a_status: 'B', pompa_del_b_status: 'B',
    pompa_bos1a_status: 'B', pompa_bos2a_status: 'B', pompa_bos1b_status: 'B', pompa_bos2b_status: 'B',
    ground_tank_status: 'B', roof_tank_a_status: 'B', roof_tank_b_status: 'B',
    air_alarm_status: 'B', sound_system_status: 'B', access_control_status: 'B',
    cctv_status: 'B', easv_status: 'B', p_pabx_status: 'B', tv_cable_status: 'B',
    general_remarks: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/check-sheets`, { headers: { Authorization: `Bearer ${token}` } });
      setData(res.data.data || []);
    } catch (error) { toast.error('Failed to fetch'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/check-sheets`, formData, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Check Sheet berhasil disimpan!');
      setShowForm(false);
      setFormData(initialFormState);
      fetchData();
    } catch (error) { toast.error(error.response?.data?.error || 'Gagal menyimpan'); }
  };

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  // Helper untuk Dropdown Status (Didefinisikan di luar render loop jika perlu, tapi ini fungsi biasa)
  const StatusSelect = ({ field }) => (
    <select 
      value={formData[field]} 
      onChange={(e) => handleChange(field, e.target.value)}
      className="w-full rounded border-gray-300 border p-1.5 text-sm focus:ring-2 focus:ring-blue-500"
    >
      <option value="B">B (Baik)</option>
      <option value="R">R (Rusak)</option>
      <option value="N">N (Normal)</option>
      <option value="T">T (Tidak Operasi)</option>
      <option value="G">G (Ganti Sparepart)</option>
      <option value="P">P (Perlu Perbaikan)</option>
      <option value="E">E (Level Kurang)</option>
      <option value="F">F (Level Penuh)</option>
      <option value="C">C (Jernih)</option>
      <option value="D">D (Kotor)</option>
    </select>
  );

  const EquipmentRow = ({ label, field }) => (
    <div className="grid grid-cols-12 gap-2 items-center mb-2">
      <div className="col-span-7 text-sm text-gray-700">{label}</div>
      <div className="col-span-5">
        <StatusSelect field={field} />
      </div>
    </div>
  );

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Building Equipment Check Sheet</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          {showForm ? 'Batal' : '+ Tambah Check Sheet'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Form Check Sheet</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tanggal</label>
                <input type="date" value={formData.reading_date} onChange={(e) => handleChange('reading_date', e.target.value)} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Shift</label>
                <select value={formData.shift_id} onChange={(e) => handleChange('shift_id', parseInt(e.target.value))} className="w-full border rounded p-2">
                  <option value="1">Shift 1 (07:00-15:00)</option>
                  <option value="2">Shift 2 (15:00-22:00)</option>
                  <option value="3">Shift 3 (22:00-07:00)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Petugas</label>
                <input type="text" value={formData.petugas} onChange={(e) => handleChange('petugas', e.target.value)} className="w-full border rounded p-2" required />
              </div>
            </div>

            {/* SHIFT 1 EQUIPMENT */}
            <div className="border-t pt-4">
              <h3 className="font-bold text-lg mb-3 text-blue-700">Shift 1 Equipment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <EquipmentRow label="Water Level" field="water_level_status" />
                <EquipmentRow label="Motor Equalizing 1" field="motor_eq1_status" />
                <EquipmentRow label="Motor Equalizing 2" field="motor_eq2_status" />
                <EquipmentRow label="Motor Boster 1" field="motor_boster1_status" />
                <EquipmentRow label="Motor Boster 2" field="motor_boster2_status" />
                <EquipmentRow label="Buzzer" field="buzzer_status" />
                <EquipmentRow label="Screen" field="screen_status" />
                <EquipmentRow label="Exhaust Fan" field="exhaust_fan_status" />
                <EquipmentRow label="Pressure Air" field="pressure_air_status" />
                <EquipmentRow label="Chiller/Dosing Pump" field="chiller_dosing_status" />
                <EquipmentRow label="Water Level Dosing Pump" field="water_level_dosing_status" />
              </div>
            </div>

            {/* SHIFT 2 EQUIPMENT */}
            <div className="border-t pt-4">
              <h3 className="font-bold text-lg mb-3 text-green-700">Shift 2 Equipment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <EquipmentRow label="Floor Ceiling Light" field="floor_light_status" />
                <EquipmentRow label="Facade Light" field="facade_light_status" />
                <EquipmentRow label="Swimming Light" field="swimming_light_status" />
                <EquipmentRow label="Light B1" field="light_b1_status" />
                <EquipmentRow label="Light B2" field="light_b2_status" />
                <EquipmentRow label="Stairs Zone A" field="stairs_a_status" />
                <EquipmentRow label="Stairs Zone B" field="stairs_b_status" />
                <EquipmentRow label="Radiator Water" field="radiator_status" />
                <EquipmentRow label="Jockey Pump" field="jockey_pump_status" />
                <EquipmentRow label="Hydrant Pump" field="hydrant_pump_status" />
                <EquipmentRow label="Hydrant Diesel" field="hydrant_diesel_status" />
                <EquipmentRow label="Sumpit Pump 1" field="sumpit1_status" />
                <EquipmentRow label="Sumpit Pump 2" field="sumpit2_status" />
                <EquipmentRow label="Sumpit Pump 3" field="sumpit3_status" />
                <EquipmentRow label="Sumpit Pump 4" field="sumpit4_status" />
              </div>
            </div>

            {/* SHIFT 3 EQUIPMENT */}
            <div className="border-t pt-4">
              <h3 className="font-bold text-lg mb-3 text-purple-700">Shift 3 Equipment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <EquipmentRow label="Panel Control Genset" field="panel_genset_status" />
                <EquipmentRow label="Elevator 1" field="elevator1_status" />
                <EquipmentRow label="Elevator 2" field="elevator2_status" />
                <EquipmentRow label="Elevator 3" field="elevator3_status" />
                <EquipmentRow label="Elevator 4" field="elevator4_status" />
                <EquipmentRow label="Elevator 5" field="elevator5_status" />
                <EquipmentRow label="Pompa Delivery A" field="pompa_del_a_status" />
                <EquipmentRow label="Pompa Delivery B" field="pompa_del_b_status" />
                <EquipmentRow label="Pompa Boster 1A" field="pompa_bos1a_status" />
                <EquipmentRow label="Pompa Boster 2A" field="pompa_bos2a_status" />
                <EquipmentRow label="Pompa Boster 1B" field="pompa_bos1b_status" />
                <EquipmentRow label="Pompa Boster 2B" field="pompa_bos2b_status" />
                <EquipmentRow label="Ground Tank" field="ground_tank_status" />
                <EquipmentRow label="Roof Tank A" field="roof_tank_a_status" />
                <EquipmentRow label="Roof Tank B" field="roof_tank_b_status" />
                <EquipmentRow label="Air Alarm" field="air_alarm_status" />
                <EquipmentRow label="Sound System" field="sound_system_status" />
                <EquipmentRow label="Access Control" field="access_control_status" />
                <EquipmentRow label="CCTV" field="cctv_status" />
                <EquipmentRow label="EASV" field="easv_status" />
                <EquipmentRow label="P-PABX" field="p_pabx_status" />
                <EquipmentRow label="TV-Cable" field="tv_cable_status" />
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium mb-1">General Remarks</label>
              <textarea value={formData.general_remarks} onChange={(e) => handleChange('general_remarks', e.target.value)} className="w-full border rounded p-2" rows="3"></textarea>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">Simpan Check Sheet</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CheckSheets;