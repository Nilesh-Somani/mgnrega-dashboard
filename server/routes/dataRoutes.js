const express = require('express');
const router = express.Router();
const { getDistrictData } = require('../controllers/dataController');
const { getDistrictFromCoords } = require('../services/geolocationService');
const districts = require('../constants/districts');

router.get('/', (req, res) => {
  res.json(districts);
});

router.get('/locate', async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: 'Missing coordinates' });

  try {
    const { district, state } = await getDistrictFromCoords(lat, lng);
    if (!district) return res.status(404).json({ error: 'District not found' });

    res.json({ district, state });
  } catch (err) {
    console.error('Locate error:', err.message);
    res.status(500).json({ error: 'Failed to locate district' });
  }
});

router.get('/:district', getDistrictData);

module.exports = router;
