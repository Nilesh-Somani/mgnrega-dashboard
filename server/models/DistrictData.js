const mongoose = require('mongoose');

const districtDataSchema = new mongoose.Schema({
  district: String,
  data: Object,
  updatedAt: Date
});

module.exports = mongoose.model('DistrictData', districtDataSchema);
