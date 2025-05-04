const router = require('express').Router();
let Asset = require('../models/Asset.model');

router.route('/').get(async (req, res) => {
  try {
    const assets = await Asset.find().sort({ createdAt: -1 });
    res.json(assets);
  } catch (err) {
    console.error(`Error while fetching data: ${err}`);
    res.status(400).json('Error: ' + err);
  }
});

router.route('/:id').get(async (req, res) => {
  try {
    const asset = await Data.findById(req.params.id);
    if (asset) res.json(asset);
    else {
      console.log(`Asset with id ${req.params.id} not found.`);
      res.status(404).json(`Error: Asset with id ${req.params.id} not found.`);
    }
  } catch (err) {
    console.error(`Error while fetching asset: ${err}`);
    res.status(400).json('Error: ' + err);
  }
});

router.route('/add').post(async (req, res) => {
  const { assetName, lifeSpan, maintenanceDue } = req.body;

  const asset = {
    assetName,
    lifeSpan,
    maintenanceDue,
  };

  try {
    const newEntry = new Asset(asset);
    const response = await newEntry.save();
    res.json(response);
  } catch (err) {
    console.error(`Failed to create new Asset document with error: ${err}`);
    res.status(400).json(`Error ${err}`);
  }
});

router.route('/update/:assetName').post(async (req, res) => {
  try {
    const asset = await Asset.findOne({ assetName: req.params.assetName });
    asset.assetName = req.body.assetName || asset.assetName;
    asset.lifeSpan = req.body.lifeSpan || asset.lifeSpan;
    asset.maintenanceDue = req.body.maintenanceDue || asset.maintenanceDue;

    const response = await asset.save();
    res.json(response);
  } catch (err) {
    console.error(`Failed to update asset with error: ${err}`);
    res.status(400).json(`Error: ${err}`);
  }
});

router.route('/:id').delete((req, res) => {
  AssetfindByIdAndDelete(req.params.id)
    .then(() => res.json('Asset deleted'))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
