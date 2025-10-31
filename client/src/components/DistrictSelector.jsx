import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const DistrictSelector = ({ value, onChange }) => {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    axios.get('https://mgnrega-dashboard-server.onrender.com/api/data')
      .then(res => setDistricts(res.data))
      .catch(err => console.error('Failed to load districts', err));
  }, []);

  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full md:w-1/3 p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">{t("Select District")}</option>
      {districts.map(d => (
        <option key={d} value={d}>
          {i18n.language === 'hi' ? t(d) : d}
        </option>
      ))}
    </select>
  );
};

export default DistrictSelector;
