const axios = require('axios');

const getDistrictFromCoords = async (lat, lng) => {
  try {
    const url = `https://api.opencagedata.com/geocode/v1/json?key=${process.env.OPENCAGE_KEY}&q=${lat},${lng}&pretty=1&no_annotations=1&language=en`;
    console.log('OpenCage URL:', url);

    const response = await axios.get(url);
    const components = response.data.results[0]?.components || {};
    console.log('OpenCage components:', components);

    const district = components.state_district || components.county || components.city;
    const state = components.state;

    return {
      district: district ? district.toUpperCase() : null,
      state: state ? state.toUpperCase() : null
    };
  } catch (error) {
    console.error('Geolocation error:', error.message);
    return { district: null, state: null };
  }
};

module.exports = { getDistrictFromCoords };