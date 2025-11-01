const axios = require('axios');
const DistrictData = require('../models/DistrictData');
const districts = require('../constants/districts');

exports.getDistrictData = async (req, res) => {
    const district = req.params.district.toUpperCase();
    const state = req.query.state?.toUpperCase() || 'RAJASTHAN';
    let cached = null;

    console.log('Requested district:', district);
    if (!districts) {
        console.error('District list is undefined!');
    }
    if (!isRajasthanDistrict) {
        console.warn('District not in Rajasthan list:', district);
    }

    try {
        cached = await DistrictData.findOne({ district });
        if (cached) {
            console.log('Cached data found. Last updated:', new Date(cached.updatedAt));
        }

        if (cached && Date.now() - cached.updatedAt < 86400000) {
            console.log('Returning cached data');
            return res.json(cached.data);
        }

        // Build API URL conditionally
        const baseUrl = `https://api.data.gov.in/resource/${process.env.RESOURCE_ID}?api-key=${process.env.DATA_GOV_API_KEY}&format=json`;
        const filters = `&filters[state_name]=${state}&filters[district_name]=${district}`;
        const apiUrl = `${baseUrl}${filters}&limit=10000`;

        console.log('Gov API URL:', apiUrl);

        const response = await axios.get(apiUrl);
        const data = response.data;

        console.log('Gov API response:', data);

        if (!data || !data.records || data.records.length === 0) {
            console.warn('Gov API returned no records');
            throw new Error('No data returned from API');
        }

        await DistrictData.findOneAndUpdate(
            { district },
            { data, updatedAt: Date.now() },
            { upsert: true }
        );

        console.log('Data saved to cache');
        res.json(data);
    } catch (err) {
        console.error('Error fetching data:', err.message);
        if (cached) {
            console.log('Returning stale cached data');
            return res.json(cached.data);
        }
        res.status(500).json({ error: 'Failed to fetch data and no cached version available.' });
    }
};