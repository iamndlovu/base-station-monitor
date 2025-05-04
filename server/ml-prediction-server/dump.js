const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { getRandomInt } = require('./random');

const Asset = require('./models/Asset.model');
const Data = require('./models/Data.model');

// Initialize express app
const app = express();

//middleware
app.use(express.json());
app.use(cors());

//mongoose
mongoose
  .connect('mongodb://127.0.0.1:27017/base-station-monitor')
  .then(() => console.log('MOngoDB database connected'));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

// API ENDPOINTS
app.post('/', async (req, res) => {
  const { count } = req.body;
  console.log(count);
  for (let i = 0; i < count; i++) {
    const tempVal = getRandomInt(0, 51);
    const batteryVal = getRandomInt(0, 101);
    const fuelVal = getRandomInt(0, 101);
    const signalVal = getRandomInt(0, 101);

    const generator = await Asset.findOne({ assetName: 'generator' });
    const ups = await Asset.findOne({ assetName: 'ups' });
    const airCon = await Asset.findOne({ assetName: 'air con' });
    const baseRepeater = await Asset.findOne({ assetName: 'base repeater' });

    const data = {
      temperature: {
        tempVal,
        fan: tempVal > 28 ? 1 : 0,
        h: 27,
        hh: 32,
        l: 18,
        ll: 13,
        max: 50,
        min: 0,
      },
      battery: {
        ups: Boolean(getRandomInt(0, 2)),
        level: batteryVal,
        l: 30,
        ll: 15,
        h: 70,
        hh: 80,
        max: 100,
        min: 0,
      },
      fuel: {
        generator: Boolean(getRandomInt(0, 2)),
        level: fuelVal,
        l: 25,
        ll: 10,
        h: 70,
        hh: 90,
        max: 100,
        min: 0,
      },
      signal: {
        strength: signalVal,
        l: 70,
        ll: 60,
        h: 80,
        hh: 90,
        max: 100,
        min: 0,
      },
    };
    // normal temperatures
    if (tempVal < 27) {
      // for ups
      if (batteryVal > 50 && data.battery.ups) {
        ups.maintenanceDue = [...ups.maintenanceDue, getRandomInt(180, 300)];
        ups.lifeSpan = [...ups.lifeSpan, getRandomInt(365 * 3, 365 * 5)];
      } else {
        ups.maintenanceDue = [...ups.maintenanceDue, getRandomInt(0, 180)];
        ups.lifeSpan = [...ups.lifeSpan, getRandomInt(180, 365 * 3)];
      }
      // for generator
      if (fuelVal > 50 && data.fuel.generator) {
        generator.maintenanceDue = [
          ...generator.maintenanceDue,
          getRandomInt(180, 300),
        ];
        generator.lifeSpan = [
          ...generator.lifeSpan,
          getRandomInt(365 * 3, 365 * 5),
        ];
      } else {
        generator.maintenanceDue = [
          ...generator.maintenanceDue,
          getRandomInt(0, 180),
        ];
        generator.lifeSpan = [
          ...generator.lifeSpan,
          getRandomInt(180, 365 * 3),
        ];
      }
      // for air con
      if (data.temperature.fan) {
        airCon.maintenanceDue = [
          ...airCon.maintenanceDue,
          getRandomInt(180, 300),
        ];
        airCon.lifeSpan = [...airCon.lifeSpan, getRandomInt(365 * 3, 365 * 5)];
      } else {
        airCon.maintenanceDue = [
          ...airCon.maintenanceDue,
          getRandomInt(0, 180),
        ];
        airCon.lifeSpan = [...airCon.lifeSpan, getRandomInt(180, 365 * 3)];
      }
      // for base repeater
      if (signalVal > 50) {
        baseRepeater.maintenanceDue = [
          ...baseRepeater.maintenanceDue,
          getRandomInt(45, 300),
        ];
        baseRepeater.lifeSpan = [
          ...baseRepeater.lifeSpan,
          getRandomInt(365 * 2, 365 * 5),
        ];
      } else {
        baseRepeater.maintenanceDue = [
          ...baseRepeater.maintenanceDue,
          getRandomInt(0, 45),
        ];
        baseRepeater.lifeSpan = [
          ...baseRepeater.lifeSpan,
          getRandomInt(180, 365 * 2),
        ];
      }
    } else if (tempVal < 32) {
      // high temperatures
      // for ups
      if (batteryVal > 30 && data.battery.ups) {
        ups.maintenanceDue = [...ups.maintenanceDue, getRandomInt(180, 300)];
        ups.lifeSpan = [...ups.lifeSpan, getRandomInt(365 * 2, 365 * 4)];
      } else {
        ups.maintenanceDue = [...ups.maintenanceDue, getRandomInt(0, 150)];
        ups.lifeSpan = [...ups.lifeSpan, getRandomInt(180, 365 * 2)];
      }
      // for generator
      if (fuelVal > 30 && data.fuel.generator) {
        generator.maintenanceDue = [
          ...generator.maintenanceDue,
          getRandomInt(180, 300),
        ];
        generator.lifeSpan = [
          ...generator.lifeSpan,
          getRandomInt(365 * 2, 365 * 4),
        ];
      } else {
        generator.maintenanceDue = [
          ...generator.maintenanceDue,
          getRandomInt(0, 150),
        ];
        generator.lifeSpan = [
          ...generator.lifeSpan,
          getRandomInt(180, 365 * 2),
        ];
      }
      // for air con
      if (data.temperature.fan) {
        airCon.maintenanceDue = [
          ...airCon.maintenanceDue,
          getRandomInt(90, 200),
        ];
        airCon.lifeSpan = [...airCon.lifeSpan, getRandomInt(365 * 2, 365 * 4)];
      } else {
        airCon.maintenanceDue = [...airCon.maintenanceDue, getRandomInt(2, 90)];
        airCon.lifeSpan = [...airCon.lifeSpan, getRandomInt(150, 365 * 2)];
      }
      // for base repeater
      if (signalVal > 40) {
        baseRepeater.maintenanceDue = [
          ...baseRepeater.maintenanceDue,
          getRandomInt(45, 280),
        ];
        baseRepeater.lifeSpan = [
          ...baseRepeater.lifeSpan,
          getRandomInt(365 * 2, 365 * 4),
        ];
      } else {
        baseRepeater.maintenanceDue = [
          ...baseRepeater.maintenanceDue,
          getRandomInt(2, 45),
        ];
        baseRepeater.lifeSpan = [
          ...baseRepeater.lifeSpan,
          getRandomInt(150, 365 * 2),
        ];
      }
    } else {
      // very high temperatures
      // for ups
      if (batteryVal > 30 && data.battery.ups) {
        ups.maintenanceDue = [...ups.maintenanceDue, getRandomInt(180, 300)];
        ups.lifeSpan = [...ups.lifeSpan, getRandomInt(365 * 2, 365 * 4)];
      } else {
        ups.maintenanceDue = [...ups.maintenanceDue, getRandomInt(0, 150)];
        ups.lifeSpan = [...ups.lifeSpan, getRandomInt(180, 365 * 2)];
      }
      // for generator
      if (fuelVal > 25 && data.fuel.generator) {
        generator.maintenanceDue = [
          ...generator.maintenanceDue,
          getRandomInt(180, 300),
        ];
        generator.lifeSpan = [
          ...generator.lifeSpan,
          getRandomInt(365 * 2, 365 * 4),
        ];
      } else {
        generator.maintenanceDue = [
          ...generator.maintenanceDue,
          getRandomInt(3, 150),
        ];
        generator.lifeSpan = [
          ...generator.lifeSpan,
          getRandomInt(180, 365 * 2),
        ];
      }
      // for air con
      if (data.temperature.fan) {
        airCon.maintenanceDue = [...airCon.maintenanceDue, getRandomInt(5, 20)];
        airCon.lifeSpan = [...airCon.lifeSpan, getRandomInt(365, 365 * 2)];
      } else {
        airCon.maintenanceDue = [...airCon.maintenanceDue, getRandomInt(2, 18)];
        airCon.lifeSpan = [...airCon.lifeSpan, getRandomInt(150, 365)];
      }
      // for base repeater
      if (signalVal > 30) {
        baseRepeater.maintenanceDue = [
          ...baseRepeater.maintenanceDue,
          getRandomInt(30, 200),
        ];
        baseRepeater.lifeSpan = [
          ...baseRepeater.lifeSpan,
          getRandomInt(365, 365 * 2),
        ];
      } else {
        baseRepeater.maintenanceDue = [
          ...baseRepeater.maintenanceDue,
          getRandomInt(2, 20),
        ];
        baseRepeater.lifeSpan = [
          ...baseRepeater.lifeSpan,
          getRandomInt(20, 386),
        ];
      }
    }

    // save data to database
    try {
      const dataEntry = new Data({
        temperature: data.temperature,
        battery: data.battery,
        fuel: data.fuel,
        signal: data.signal,
      });
      await dataEntry.save();
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Failed to send data to s1erver' });
      return;
    }
    // save asset data to database
    try {
      await generator.save();
      await ups.save();
      await airCon.save();
      await baseRepeater.save();
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Failed to save asset data' });
      return;
    }
    console.log('Data sent to server:', data);
    console.log('Asset data sent to server:', {
      generator,
      ups,
      airCon,
      baseRepeater,
    });
    console.log('----------------------------------------');
  }

  res.status(200).json({ message: 'Data sent to server' });
});
