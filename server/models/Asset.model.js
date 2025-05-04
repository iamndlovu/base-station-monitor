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
      default: [],
    },
    maintenanceDue: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Asset = model('Asset', AssetSchema);

module.exports = Asset;
