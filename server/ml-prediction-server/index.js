const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');
const { train } = require('./training');

const Data = require('./models/Data.model');
const Asset = require('./models/Asset.model');

let sensorData = [],
  assetList = [];

let maintenanceModels = {
  generator: null,
  'air con': null,
  'base repeater': null,
  ups: null,
};

// Load trained model
const loadModel = async (modelName) => {
  try {
    const modelPath = path.join(__dirname, `${modelName}_model`);
    const model = await tf.loadLayersModel(`file://${modelPath}/model.json`);
    maintenanceModels[modelName] = model;
    console.log(`Model ${modelName} loaded successfully`);
  } catch (error) {
    console.error(`Error loading model ${modelName}:`, error);
  }
};

// check if file exists
const checkFileExists = (filePath) => {
  return fs.promises
    .access(filePath, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
};

// Load models if they exist
const loadModels = async () => {
  const modelNames = Object.keys(maintenanceModels);
  let modelPathError = false;
  for (let modelName of modelNames) {
    modelName = modelName.toLowerCase().replace(/ /g, '_');
    const modelPath = path.join(__dirname, `${modelName}_model`);
    const modelExists = await checkFileExists(modelPath);
    if (modelExists) {
      await loadModel(modelName);
    } else {
      console.log(`Model ${modelName} does not exist`);
      modelPathError = true;
    }
  }
  if (modelPathError)
    throw new Error(
      `One or more model paths do not exist. Please train the models first.\nMake GET request to /train endpoint to train and save the models.`
    );
};
loadModels()
  .then(() => console.log('All models loaded'))
  .catch((error) => console.error('Error loading models:', error));

// Initialize express app
const app = express();

//middleware
app.use(express.json());
app.use(cors());

//mongoose
mongoose
  .connect('mongodb://127.0.0.1:27017/base-station-monitor')
  .then(() => console.log('MOngoDB database connected'));

const fetchFromDB = async () => {
  sensorData = await Data.find().sort({ createdAt: -1 });
  assetList = await Asset.find().sort({ assetName: -1 });
};

fetchFromDB();
const fetchFromDBPeriodically = setInterval(() => fetchFromDB(), 60000);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

// API ENDPOINTS
app.get('/train', async (req, res) => {
  const tempList = sensorData.map((data, index) => {
    let sum = 0;
    for (let i = 0; i <= index; i++) {
      sum += sensorData[i].temperature.tempVal;
    }

    return [data.temperature.tempVal, sum / (index + 1)];
  });

  const signalList = sensorData.map((data, index) => {
    let sum = 0;
    for (let i = 0; i <= index; i++) {
      sum += sensorData[i].signal.strength;
    }

    return [data.signal.strength, sum / (index + 1)];
  });

  const fuelList = sensorData.map((data, index) => {
    let sum = 0;
    for (let i = 0; i <= index; i++) {
      sum += sensorData[i].fuel.level;
    }

    return [data.fuel.level, sum / (index + 1)];
  });

  const batteryList = sensorData.map((data, index) => {
    let sum = 0;
    for (let i = 0; i <= index; i++) {
      sum += sensorData[i].battery.level;
    }

    return [data.battery.level, sum / (index + 1)];
  });

  // GENERATOR ML MODEL TRAINING DATA
  const xArrayGenerator = [];
  const yArrayGenerator = assetList
    .filter((asset) => asset.assetName === 'generator')
    .map((asset) => {
      const yArray = [];
      for (let i = 0; i < asset.lifeSpan.length; i++) {
        yArray.push([asset.lifeSpan[i], asset.maintenanceDue[i]]);
      }
      return yArray;
    })[0];

  // UPS ML MODEL TRAINING DATA
  const xArrayUPS = [];
  const yArrayUPS = assetList
    .filter((asset) => asset.assetName === 'ups')
    .map((asset) => {
      const yArray = [];
      for (let i = 0; i < asset.lifeSpan.length; i++) {
        yArray.push([asset.lifeSpan[i], asset.maintenanceDue[i]]);
      }
      return yArray;
    })[0];

  // AIR CONDITIONER ML MODEL TRAINING DATA
  const xArrayAirCon = [];
  const yArrayAirCon = assetList
    .filter((asset) => asset.assetName === 'air con')
    .map((asset) => {
      const yArray = [];
      for (let i = 0; i < asset.lifeSpan.length; i++) {
        yArray.push([asset.lifeSpan[i], asset.maintenanceDue[i]]);
      }
      return yArray;
    })[0];

  // BASE REPEATER ML MODEL TRAINING DATA
  const xArrayBaseRepeater = [];
  const yArrayBaseRepeater = assetList
    .filter((asset) => asset.assetName === 'base repeater')
    .map((asset) => {
      const yArray = [];
      for (let i = 0; i < asset.lifeSpan.length; i++) {
        yArray.push([asset.lifeSpan[i], asset.maintenanceDue[i]]);
      }
      return yArray;
    })[0];

  // Check if all lists have the same length
  if (
    tempList.length !== batteryList.length ||
    tempList.length !== signalList.length ||
    tempList.length !== fuelList.length ||
    tempList.length !== yArrayGenerator.length
  ) {
    return res.status(400).json({
      message: 'Data length mismatch',
      tempListLen: tempList.length,
      batteryListLen: batteryList.length,
      signalListLen: signalList.length,
      fuelListLen: fuelList.length,
      yArrayGeneratorLen: yArrayGenerator.length,
    });
  }

  try {
    for (let i = 0; i < tempList.length; i++) {
      xArrayGenerator.push([
        tempList[i][0],
        tempList[i][1],
        fuelList[i][0],
        fuelList[i][1],
      ]);

      xArrayUPS.push([
        tempList[i][0],
        tempList[i][1],
        batteryList[i][0],
        batteryList[i][1],
      ]);

      xArrayAirCon.push([tempList[i][0], tempList[i][1]]);

      xArrayBaseRepeater.push([
        tempList[i][0],
        tempList[i][1],
        signalList[i][0],
        signalList[i][1],
      ]);
    }
  } catch (error) {
    console.error('Error creating xArray:', error);
    return res.status(500).json({ message: 'Error creating xArray' });
  }

  // Train the models
  try {
    const genModel = await train({
      xArray: xArrayGenerator,
      yArray: yArrayGenerator,
    });
    const upsModel = await train({ xArray: xArrayUPS, yArray: yArrayUPS });
    const airConModel = await train({
      xArray: xArrayAirCon,
      yArray: yArrayAirCon,
    });
    const baseRepeaterModel = await train({
      xArray: xArrayBaseRepeater,
      yArray: yArrayBaseRepeater,
    });

    await genModel.save('file://' + path.join(__dirname, 'generator_model'));
    await upsModel.save('file://' + path.join(__dirname, 'ups_model'));
    await airConModel.save('file://' + path.join(__dirname, 'air_con_model'));
    await baseRepeaterModel.save(
      'file://' + path.join(__dirname, 'base_repeater_model')
    );

    maintenanceModels.generator = genModel;
    maintenanceModels.ups = upsModel;
    maintenanceModels['air con'] = airConModel;
    maintenanceModels['base repeater'] = baseRepeaterModel;
  } catch (error) {
    console.error('Error training models:', error);
    return res.status(500).json({ message: 'Error training models' });
  }

  console.log('Models trained and saved successfully');

  res.json({
    message: 'Models trained and saved successfully',
    models: Object.keys(maintenanceModels),
  });
});

//PREDICTION ENDPOINT
app.post('/predict', async (req, res) => {
  let { X, modelName } = req.body;

  modelName = modelName.toLowerCase().replace(/ /g, '_');
  const inputTensor = tf.tensor2d([X]);
  const model = maintenanceModels[modelName];

  if (!model) {
    return res.status(400).json({ message: `Model ${modelName} not found` });
  }

  try {
    const prediction = model.predict(inputTensor);
    const predictionArray = Array.from(prediction.dataSync());
    res.json({ prediction: predictionArray });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error making prediction -> ${modelName}` });
  }
});
