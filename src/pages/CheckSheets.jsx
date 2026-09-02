import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://nirvana-mep-api-ffa0h4hsbtdkeucv.southeastasia-01.azurewebsites.net';

const CheckSheets = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sheets, setSheets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [shiftId, setShiftId] = useState(1);
  
  const [formData, setFormData] = useState({
    reading_date: new Date().toISOString().split('T')[0],
    shift_id: 1,
    petugas: '',
    general_remarks: '',
    // Shift 1
    lvmdp_status: '-', capacitor_bank_status: '-', hvmdp_status: '-',
    transformer_temp: '-', transformer_vol: '-', temperatur_status: '-',
    volume_status: '-', volume_solar_harian: '-',
    battery_charger_1: '-', battery_24vdc_1: '-',
    volume_solar_utama: '-', battery_charger_2: '-', battery_24vdc_2: '-',
    catat_meter_pam: '-', catat_meter_deep_well: '-',
    pompa_delivery_ab: '-', pompa_boster_12a: '-', pompa_boster_12b: '-',
    ground_tank: '-', roof_tank_a: '-', roof_tank_b: '-',
    // Shift 2
    floor_ceiling_light: '-', facade_light: '-', swimming_light: '-',
    light_b1: '-', light_b2: '-', stairs_zone_a: '-', stairs_zone_b: '-',
    radiator_water: '-', battery_charger_s2: '-', battery_24vdc_s2: '-',
    jockey_pump: '-', hydrant_pump: '-', hydrant_diesel: '-',
    sumpit_pump_1: '-', sumpit_pump_2: '-', sumpit_pump_3: '-', sumpit_pump_4: '-',
    // Shift 3
    panel_control_genset: '-', battery_charger_s3: '-', battery_24vdc_s3: '-',
    elevator_1: '-', elevator_2: '-', elevator_3: '-', elevator_4: '-', elevator_5: '-',
    pompa_delivery_ab_s3: '-', pompa_boster_12a_s3: '-', pompa_boster_12b_s3: '-',
    ground_tank_s3: '-', roof_tank_a_s3: '-', roof_tank_b_s3: '-',
    jocky_pompa_s3: '-', hydrant_pompa_s3: '-', hydrant_diesel_s3: '-',
    fire_alarm: '-', sound_system: '-', access_control: '-', cctv: '-',
    bas_b: '-', ip_pabx: '-', tv_cable: '-',
    // General (07:00 & 18:00)
    water_level_07: '-', motor_eq1_07: '-', motor_eq2_07: '-',
    motor_boster1_07: '-', motor_boster2_07: '-', buzzer_07: '-',
    bar_screen_07: '-', exhaust_fan_07: '-', frlss_air_07: '-',
    chiller_dosing_07: '-', water_level_dosing_07: '-',
    water_level_18: '-', motor_eq1_18: '-', motor_eq2_18: '-',
    motor_boster1_18: '-', motor_boster2_18: '-', buzzer_18: '-',
    bar_screen_18: '-', exhaust_fan_18: '-', frlss_air_18: '-',
    chiller_dosing_18: '-', water_level_dosing_18: '-'
  });

  const fetchSheets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/check-sheets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSheets(response.data.data || []);
    } catch (error) {
      console.error('Error fetching sheets:', error);
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheets();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleShiftChange = (e) => {
    const newShiftId = parseInt(e.target.value);
    setShiftId(newShiftId);
    setFormData(prev => ({ ...prev, shift_id: newShiftId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      console.log('📤 Sending data:', formData);

      const response = await axios.post(
        `${API_BASE_URL}/api/check-sheets`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Response:', response.data);

      if (response.data && response.data.success) {
        toast.success('Check sheet berhasil disimpan!');
        setShowForm(false);
        fetchSheets();
      } else {
        toast.error('Gagal menyimpan data');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      console.error('Response:', error.response?.data);
      toast.error('Gagal menyimpan: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus data ini?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/check-sheets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Data dihapus');
      fetchSheets();
    } catch (error) {
      toast.error('Gagal menghapus');
    }
  };

  const statusOptions = [
    { value: '-', label: '-' },
    { value: 'B', label: 'B (Baik)' },
    { value: 'R', label: 'R (Rusak)' },
    { value: 'N', label: 'N (Normal)' },
    { value: 'T', label: 'T (Tidak Beroperasi)' },
    { value: 'G', label: 'G (Ganti Spare Part)' },
    { value: 'P', label: 'P (Perbaikan Kecil)' },
    { value: 'E', label: 'E (Level Kurang)' },
    { value: 'F', label: 'F (Level Penuh)' },
    { value: 'C', label: 'C (Jernih)' },
    { value: 'D', label: 'D (Kotor)' },
    { value: 'M', label: 'M (Manual)' },
    { value: 'A', label: 'A (Auto)' },
    { value: 'F/M/L', label: 'F/M/L' }
  ];

  const SelectField = ({ label, name, value }) => (
    <div className="mb-2">
      <label className="block text-xs font-medium mb-1 text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
      >
        {statusOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  const InputField = ({ label, name, value, placeholder }) => (
    <div className="mb-2">
      <label className="block text-xs font-medium mb-1 text-gray-700">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Building Equipment Check Sheet</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Tutup Form' : '+ Tambah Check Sheet'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Form Check Sheet</h2>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tanggal</label>
              <input
                type="date"
                name="reading_date"
                value={formData.reading_date}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Shift</label>
              <select
                name="shift_id"
                value={shiftId}
                onChange={handleShiftChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value={1}>Shift 1 (07:00-15:00)</option>
                <option value={2}>Shift 2 (15:00-22:00)</option>
                <option value={3}>Shift 3 (22:00-07:00)</option>
                <option value={4}>General (07:00-07:00)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Petugas</label>
              <input
                type="text"
                name="petugas"
                value={formData.petugas}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Nama petugas"
              />
            </div>
          </div>

          {/* SHIFT 1: 07:00-15:00 - Electrical/Pump */}
          {shiftId === 1 && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-bold mb-3 text-blue-600">Shift 1 Equipment (07:00-15:00)</h3>
              
              <div className="mb-4">
                <h4 className="font-semibold text-sm mb-2 text-gray-700">Electrical</h4>
                <div className="grid grid-cols-3 gap-3">
                  <SelectField label="LVMDP" name="lvmdp_status" value={formData.lvmdp_status} />
                  <SelectField label="Capacitor Bank" name="capacitor_bank_status" value={formData.capacitor_bank_status} />
                  <SelectField label="HVMDP" name="hvmdp_status" value={formData.hvmdp_status} />
                  <InputField label="Transformer Temp" name="transformer_temp" value={formData.transformer_temp} />
                  <InputField label="Transformer Volt" name="transformer_vol" value={formData.transformer_vol} />
                  <InputField label="Temperatur" name="temperatur_status" value={formData.temperatur_status} />
                  <InputField label="Volume" name="volume_status" value={formData.volume_status} />
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-sm mb-2 text-gray-700">Solar & Battery</h4>
                <div className="grid grid-cols-3 gap-3">
                  <InputField label="Volume Solar Harian" name="volume_solar_harian" value={formData.volume_solar_harian} />
                  <SelectField label="Battery Charger 1" name="battery_charger_1" value={formData.battery_charger_1} />
                  <SelectField label="Battery 24VDC 1" name="battery_24vdc_1" value={formData.battery_24vdc_1} />
                  <InputField label="Volume Solar Utama" name="volume_solar_utama" value={formData.volume_solar_utama} />
                  <SelectField label="Battery Charger 2" name="battery_charger_2" value={formData.battery_charger_2} />
                  <SelectField label="Battery 24VDC 2" name="battery_24vdc_2" value={formData.battery_24vdc_2} />
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-sm mb-2 text-gray-700">Meter & Pump</h4>
                <div className="grid grid-cols-3 gap-3">
                  <InputField label="Catat Meter PAM" name="catat_meter_pam" value={formData.catat_meter_pam} />
                  <InputField label="Catat Meter Deep Well" name="catat_meter_deep_well" value={formData.catat_meter_deep_well} />
                  <SelectField label="Pompa Delivery A&B" name="pompa_delivery_ab" value={formData.pompa_delivery_ab} />
                  <SelectField label="Pompa Boster 1-2 (A)" name="pompa_boster_12a" value={formData.pompa_boster_12a} />
                  <SelectField label="Pompa Boster 1-2 (B)" name="pompa_boster_12b" value={formData.pompa_boster_12b} />
                  <SelectField label="Ground Tank" name="ground_tank" value={formData.ground_tank} />
                  <SelectField label="Roof Tank A" name="roof_tank_a" value={formData.roof_tank_a} />
                  <SelectField label="Roof Tank B" name="roof_tank_b" value={formData.roof_tank_b} />
                </div>
              </div>
            </div>
          )}

          {/* SHIFT 2: 15:00-22:00 */}
          {shiftId === 2 && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-bold mb-3 text-green-600">Shift 2 Equipment (15:00-22:00)</h3>
              <div className="grid grid-cols-3 gap-3">
                <SelectField label="Floor Ceiling Light" name="floor_ceiling_light" value={formData.floor_ceiling_light} />
                <SelectField label="Facade Light" name="facade_light" value={formData.facade_light} />
                <SelectField label="Swimming Light" name="swimming_light" value={formData.swimming_light} />
                <SelectField label="Light B1" name="light_b1" value={formData.light_b1} />
                <SelectField label="Light B2" name="light_b2" value={formData.light_b2} />
                <SelectField label="Stairs Zone A" name="stairs_zone_a" value={formData.stairs_zone_a} />
                <SelectField label="Stairs Zone B" name="stairs_zone_b" value={formData.stairs_zone_b} />
                <SelectField label="Radiator Water" name="radiator_water" value={formData.radiator_water} />
                <SelectField label="Battery Charger" name="battery_charger_s2" value={formData.battery_charger_s2} />
                <SelectField label="Battery 24VDC" name="battery_24vdc_s2" value={formData.battery_24vdc_s2} />
                <SelectField label="Jockey Pump" name="jockey_pump" value={formData.jockey_pump} />
                <SelectField label="Hydrant Pump" name="hydrant_pump" value={formData.hydrant_pump} />
                <SelectField label="Hydrant Diesel" name="hydrant_diesel" value={formData.hydrant_diesel} />
                <SelectField label="Sumpit Pump 1" name="sumpit_pump_1" value={formData.sumpit_pump_1} />
                <SelectField label="Sumpit Pump 2" name="sumpit_pump_2" value={formData.sumpit_pump_2} />
                <SelectField label="Sumpit Pump 3" name="sumpit_pump_3" value={formData.sumpit_pump_3} />
                <SelectField label="Sumpit Pump 4" name="sumpit_pump_4" value={formData.sumpit_pump_4} />
              </div>
            </div>
          )}

          {/* SHIFT 3: 22:00-07:00 */}
          {shiftId === 3 && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-bold mb-3 text-purple-600">Shift 3 Equipment (22:00-07:00)</h3>
              <div className="grid grid-cols-3 gap-3">
                <SelectField label="Panel Control Genset" name="panel_control_genset" value={formData.panel_control_genset} />
                <SelectField label="Battery Charger" name="battery_charger_s3" value={formData.battery_charger_s3} />
                <SelectField label="Battery 24VDC" name="battery_24vdc_s3" value={formData.battery_24vdc_s3} />
                <SelectField label="Elevator 1" name="elevator_1" value={formData.elevator_1} />
                <SelectField label="Elevator 2" name="elevator_2" value={formData.elevator_2} />
                <SelectField label="Elevator 3" name="elevator_3" value={formData.elevator_3} />
                <SelectField label="Elevator 4" name="elevator_4" value={formData.elevator_4} />
                <SelectField label="Elevator 5" name="elevator_5" value={formData.elevator_5} />
                <SelectField label="Pompa Delivery A&B" name="pompa_delivery_ab_s3" value={formData.pompa_delivery_ab_s3} />
                <SelectField label="Pompa Boster 1-2 (A)" name="pompa_boster_12a_s3" value={formData.pompa_boster_12a_s3} />
                <SelectField label="Pompa Boster 1-2 (B)" name="pompa_boster_12b_s3" value={formData.pompa_boster_12b_s3} />
                <SelectField label="Ground Tank" name="ground_tank_s3" value={formData.ground_tank_s3} />
                <SelectField label="Roof Tank A" name="roof_tank_a_s3" value={formData.roof_tank_a_s3} />
                <SelectField label="Roof Tank B" name="roof_tank_b_s3" value={formData.roof_tank_b_s3} />
                <SelectField label="Jocky Pompa" name="jocky_pompa_s3" value={formData.jocky_pompa_s3} />
                <SelectField label="Hydrant Pompa" name="hydrant_pompa_s3" value={formData.hydrant_pompa_s3} />
                <SelectField label="Hydrant Diesel" name="hydrant_diesel_s3" value={formData.hydrant_diesel_s3} />
                <SelectField label="Fire Alarm" name="fire_alarm" value={formData.fire_alarm} />
                <SelectField label="Sound System" name="sound_system" value={formData.sound_system} />
                <SelectField label="Access Control" name="access_control" value={formData.access_control} />
                <SelectField label="CCTV" name="cctv" value={formData.cctv} />
                <SelectField label="BAS B" name="bas_b" value={formData.bas_b} />
                <SelectField label="IP-PABX" name="ip_pabx" value={formData.ip_pabx} />
                <SelectField label="TV Cable" name="tv_cable" value={formData.tv_cable} />
              </div>
            </div>
          )}

          {/* GENERAL SHIFT: 07:00-07:00 dengan 2 kolom waktu */}
          {shiftId === 4 && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-bold mb-3 text-orange-600">General Shift (07:00-07:00) - 2 Kolom Waktu</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Kolom 07:00 */}
                <div className="border rounded-lg p-3 bg-blue-50">
                  <h4 className="font-bold text-center mb-2 text-blue-700"> Waktu: 07:00</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <SelectField label="Water Level" name="water_level_07" value={formData.water_level_07} />
                    <SelectField label="Motor Equalizing 1" name="motor_eq1_07" value={formData.motor_eq1_07} />
                    <SelectField label="Motor Equalizing 2" name="motor_eq2_07" value={formData.motor_eq2_07} />
                    <SelectField label="Motor Boster 1" name="motor_boster1_07" value={formData.motor_boster1_07} />
                    <SelectField label="Motor Boster 2" name="motor_boster2_07" value={formData.motor_boster2_07} />
                    <SelectField label="Buzzer" name="buzzer_07" value={formData.buzzer_07} />
                    <SelectField label="Bar Screen" name="bar_screen_07" value={formData.bar_screen_07} />
                    <SelectField label="Exhaust Fan" name="exhaust_fan_07" value={formData.exhaust_fan_07} />
                    <SelectField label="FRLSS Air" name="frlss_air_07" value={formData.frlss_air_07} />
                    <SelectField label="Chiller/Dosing Pump" name="chiller_dosing_07" value={formData.chiller_dosing_07} />
                    <SelectField label="Water Level Dosing Pump" name="water_level_dosing_07" value={formData.water_level_dosing_07} />
                  </div>
                </div>

                {/* Kolom 18:00 */}
                <div className="border rounded-lg p-3 bg-green-50">
                  <h4 className="font-bold text-center mb-2 text-green-700">⏰ Waktu: 18:00</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <SelectField label="Water Level" name="water_level_18" value={formData.water_level_18} />
                    <SelectField label="Motor Equalizing 1" name="motor_eq1_18" value={formData.motor_eq1_18} />
                    <SelectField label="Motor Equalizing 2" name="motor_eq2_18" value={formData.motor_eq2_18} />
                    <SelectField label="Motor Boster 1" name="motor_boster1_18" value={formData.motor_boster1_18} />
                    <SelectField label="Motor Boster 2" name="motor_boster2_18" value={formData.motor_boster2_18} />
                    <SelectField label="Buzzer" name="buzzer_18" value={formData.buzzer_18} />
                    <SelectField label="Bar Screen" name="bar_screen_18" value={formData.bar_screen_18} />
                    <SelectField label="Exhaust Fan" name="exhaust_fan_18" value={formData.exhaust_fan_18} />
                    <SelectField label="FRLSS Air" name="frlss_air_18" value={formData.frlss_air_18} />
                    <SelectField label="Chiller/Dosing Pump" name="chiller_dosing_18" value={formData.chiller_dosing_18} />
                    <SelectField label="Water Level Dosing Pump" name="water_level_dosing_18" value={formData.water_level_dosing_18} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">General Remarks</label>
            <textarea
              name="general_remarks"
              value={formData.general_remarks}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Catatan tambahan..."
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : 'Simpan Check Sheet'}
          </button>
        </form>
      )}

      {/* Table Data */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-lg font-bold p-4 border-b">Riwayat Check Sheet</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Shift</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Petugas</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="px-4 py-8 text-center">Loading...</td></tr>
              ) : sheets.length === 0 ? (
                <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-500">Belum ada data</td></tr>
              ) : (
                sheets.map(sheet => (
                  <tr key={sheet.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{new Date(sheet.reading_date).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-2">{sheet.shift_name || `Shift ${sheet.shift_id}`}</td>
                    <td className="px-4 py-2">{sheet.petugas_general || sheet.user_name || '-'}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(sheet.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CheckSheets;