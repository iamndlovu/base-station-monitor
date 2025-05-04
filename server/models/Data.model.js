const { Schema, model } = require('mongoose');

const DataSchema = new Schema(
  {
    temperature: {
      type: Object,
      default: {
        tempVal: null,
        l: null,
        ll: null,
        h: null,
        hh: null,
        max: null,
        min: null,
        fan: null,
      },
    },
    battery: {
      type: Object,
      default: {
        ups: null,
        l: null,
        ll: null,
        h: null,
        hh: null,
        max: null,
        min: null,
        level: null,
      },
    },
    fuel: {
      type: Object,
      default: {
        generator: null,
        l: null,
        ll: null,
        h: null,
        hh: null,
        max: null,
        min: null,
        level: null,
      },
    },
    signal: {
      type: Object,
      default: {
        strength: null,
        l: null,
        ll: null,
        h: null,
        hh: null,
        max: null,
        min: null,
      },
    },
  },
  { timestamps: true }
);

const Data = model('Data', DataSchema);

module.exports = Data;
