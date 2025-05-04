const router = require('express').Router();
const Data = require('../models/Data.model');
const Asset = require('../models/Asset.model');

const predictionUrl = 'http://localhost:5001/predict';

const temperatureConstants = {
  h: 27,
  hh: 32,
  l: 18,
  ll: 13,
  max: 50,
  min: 0,
};

const fuelConstants = {
  l: 25,
  ll: 10,
  h: 70,
  hh: 90,
  max: 100,
  min: 0,
};

const batteryConstants = {
  l: 30,
  ll: 15,
  h: 70,
  hh: 80,
  max: 100,
  min: 0,
};

const signalConstants = {
  l: 70,
  ll: 60,
  h: 80,
  hh: 90,
  max: 100,
  min: 0,
};

router.route('/').get(async (req, res) => {
  try {
    const dataItems = await Data.find().sort({ createdAt: -1 });
    res.json(dataItems);
  } catch (err) {
    console.error(`Error while fetching data: ${err}`);
    res.status(400).json('Error: ' + err);
  }
});

router.route('/:id').get(async (req, res) => {
  try {
    const dataItem = await Data.findById(req.params.id);
    if (dataItem) res.json(dataItem);
    else {
      console.log(`Object with id ${req.params.id} not found.`);
      res.status(404).json(`Error: Object with id ${req.params.id} not found.`);
    }
  } catch (err) {
    console.error(`Error while fetching data: ${err}`);
    res.status(400).json('Error: ' + err);
  }
});

router.route('/add').post(async (req, res) => {
  let { temperature, battery, fuel, signal } = req.body;

  Object.assign(temperature, temperatureConstants);
  Object.assign(battery, batteryConstants);
  Object.assign(fuel, fuelConstants);
  Object.assign(signal, signalConstants);

  const dataItem = {
    temperature,
    battery,
    fuel,
    signal,
  };

  const generator = await Asset.findOne({ assetName: 'generator' });
  const ups = await Asset.findOne({ assetName: 'ups' });
  const airConditioner = await Asset.findOne({ assetName: 'air con' });
  const baseRepeater = await Asset.findOne({ assetName: 'base repeater' });

  const existingData = await Data.find();

  const avgTemperature =
    existingData
      .map((data) => data.temperature.tempVal)
      .reduce((a, b) => a + b, 0) / existingData.length;
  const avgBattery =
    existingData.map((data) => data.battery.level).reduce((a, b) => a + b, 0) /
    existingData.length;
  const avgFuel =
    existingData.map((data) => data.fuel.level).reduce((a, b) => a + b, 0) /
    existingData.length;
  const avgSignal =
    existingData
      .map((data) => data.signal.strength)
      .reduce((a, b) => a + b, 0) / existingData.length;

  let generatorLifeSpan,
    upsLifeSpan,
    airConditionerLifeSpan,
    baseRepeaterLifeSpan,
    generatorMaintenanceDue,
    upsMaintenanceDue,
    airConditionerMaintenanceDue,
    baseRepeaterMaintenanceDue;

  try {
    // Generator Prediction
    const generatorPrediction = await fetch(predictionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        X: [temperature.tempVal, avgTemperature, fuel.level, avgFuel],
        modelName: 'generator',
      }),
    });
    const generatorPredictionData = await generatorPrediction.json();
    generatorLifeSpan = generatorPredictionData.prediction[0];
    generatorMaintenanceDue = generatorPredictionData.prediction[1];

    // UPS Prediction
    const upsPrediction = await fetch(predictionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        X: [temperature.tempVal, avgTemperature, battery.level, avgBattery],
        modelName: 'ups',
      }),
    });
    const upsPredictionData = await upsPrediction.json();
    upsLifeSpan = upsPredictionData.prediction[0];
    upsMaintenanceDue = upsPredictionData.prediction[1];

    // Air Conditioner Prediction
    const airConPrediction = await fetch(predictionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        X: [temperature.tempVal, avgTemperature],
        modelName: 'air_con',
      }),
    });
    const airConPredictionData = await airConPrediction.json();
    airConditionerLifeSpan = airConPredictionData.prediction[0];
    airConditionerMaintenanceDue = airConPredictionData.prediction[1];

    // Base Repeater Prediction
    const baseRepeaterPrediction = await fetch(predictionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        X: [temperature.tempVal, avgTemperature, signal.strength, avgSignal],
        modelName: 'base_repeater',
      }),
    });
    const baseRepeaterPredictionData = await baseRepeaterPrediction.json();
    baseRepeaterLifeSpan = baseRepeaterPredictionData.prediction[0];
    baseRepeaterMaintenanceDue = baseRepeaterPredictionData.prediction[1];
  } catch (error) {
    res.status(500).json({
      error: 'Error while fetching prediction data' + error,
    });
  }

  try {
    ups.lifeSpan = [...ups.lifeSpan, upsLifeSpan];
    ups.maintenanceDue = [...ups.maintenanceDue, upsMaintenanceDue];
    await ups.save();

    generator.lifeSpan = [...generator.lifeSpan, generatorLifeSpan];
    generator.maintenanceDue = [
      ...generator.maintenanceDue,
      generatorMaintenanceDue,
    ];
    await generator.save();

    airConditioner.lifeSpan = [
      ...airConditioner.lifeSpan,
      airConditionerLifeSpan,
    ];
    airConditioner.maintenanceDue = [
      ...airConditioner.maintenanceDue,
      airConditionerMaintenanceDue,
    ];
    await airConditioner.save();

    baseRepeater.lifeSpan = [...baseRepeater.lifeSpan, baseRepeaterLifeSpan];
    baseRepeater.maintenanceDue = [
      ...baseRepeater.maintenanceDue,
      baseRepeaterMaintenanceDue,
    ];
    await baseRepeater.save();

    const newEntry = new Data(dataItem);
    const response = await newEntry.save();
    res.json(response);
  } catch (err) {
    console.error(`Failed to create new DATA document with error: ${err}`);
    res.status(400).json(`Error ${err}`);
  }
});

router.route('/:id').delete((req, res) => {
  Data.findByIdAndDelete(req.params.id)
    .then(() => res.json('Data deleted'))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
