const { Schema, model } = require('mongoose');

const AssetSchema = new Schema(
  {
    assetName: {
      type: String,
      required: true,
      unique: true,
    },
    lifeSpan: {
      type: Array,
      required: true,
    },
    maintenanceDue: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

const Asset = model('Asset', AssetSchema);

module.exports = Asset;
