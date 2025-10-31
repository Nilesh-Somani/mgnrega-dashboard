import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LanguageSwitcher from './components/LanguageSwitcher'
import DistrictSelector from './components/DistrictSelector';
import DataTable from './components/DataTable';
import PerformanceChart from './components/PerformanceChart';
import { useTranslation } from 'react-i18next';
import './i18n';

function App() {
  const { t } = useTranslation();
  const [district, setDistrict] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [data, setData] = useState(null);

  const handleDistrictChange = (newDistrict) => {
    setSelectedDistrict(newDistrict);
    setDistrict(newDistrict);
  };

  useEffect(() => {
    if (district) {
      axios.get(`https://mgnrega-dashboard-server.onrender.com/api/data/${district}`)
        .then(res => {
          // If backend returns { records: [...] }
          if (Array.isArray(res.data.records)) {
            setData(res.data.records);
          } else if (Array.isArray(res.data)) {
            setData(res.data);
          } else {
            setData([]);
          }
        })
        .catch(err => console.error(err));
    }
  }, [district]);


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      axios.get(`https://mgnrega-dashboard-server.onrender.com/api/data/locate?lat=${latitude}&lng=${longitude}`)
        .then(res => {
          const locatedDistrict = res.data.district;
          setDistrict(locatedDistrict);
          setSelectedDistrict(locatedDistrict);
        })
        .catch(err => console.error('Location error', err));
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white shadow-md rounded-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{t("MGNREGA Dashboard")}</h1>
        <LanguageSwitcher />
      </div>
      <div className="mb-6">
        <DistrictSelector value={selectedDistrict} onChange={handleDistrictChange} />
      </div>
      {data && (
        <div className="space-y-6">
          <DataTable data={data} />
          <PerformanceChart data={data} />
        </div>
      )}
    </div>
  );
}

export default App;
