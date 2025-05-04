const tf = require('@tensorflow/tfjs-node');
const path = require('path');
// import tf from '@tensorflow/tfjs-node';
// import path from 'path';

// Load and preprocess the data
async function loadData(data = { xArray: [[]], yArray: [[]] }) {
  // // Load the CSV file
  // const csvPath = path.join(
  //   __dirname,
  //   'student_performance_dataset_regression_clean.csv'
  // );

  // const dataset = tf.data.csv(`file://${csvPath}`, {
  //   columnConfigs: {
  //     Final_Exam_Score: { isLabel: true }, // Specify the target column
  //   },
  // });
  const { xArray, yArray } = data;

  const numOfFeatures = xArray[0].length;
  const numOfOutputs = yArray[0].length;

  // Convert the dataset to tensors
  const X = tf.tensor2d(xArray);
  const y = tf.tensor2d(yArray);

  return { X, y, numOfFeatures, numOfOutputs };
}

exports.train = async function (data = { xArray: [[]], yArray: [[]] }) {
  const model = tf.sequential();
  const LEARNING_RATE = 0.000001;
  const epochs = 100;
  const optimizer = tf.train.sgd(LEARNING_RATE);
  const { X, y, numOfFeatures, numOfOutputs } = await loadData(data);

  model.add(tf.layers.dense({ units: 64, inputShape: [numOfFeatures] }));
  model.add(tf.layers.dense({ units: 32, inputShape: [64] }));
  model.add(tf.layers.dense({ units: numOfOutputs, inputShape: [32] }));

  model.compile({
    optimizer,
    loss: 'meanSquaredError',
  });

  let result = await model.fit(X, y, {
    validationSplit: 0.15,
    epochs,
    shuffle: true,
    batchSize: 4,
  });

  if (result.history.loss.length === epochs) {
    console.log('Model trained successfully');
    console.log('Training Loss:', result.history.loss);
    console.log('Validation Loss:', result.history.val_loss);
    console.log('Epochs:', epochs);
    return model;
  } else {
    console.log('Model training failed');
    return null;
  }
};

// const model = exports.train({
//   xArray: [[1], [2], [3], [4], [5]],
//   yArray: [[2], [4], [6], [8], [10]],
// });

// model.then((model) => {
//   model.summary();
//   // tf.loadLayersModel();

//   async function makePredictions(inputData = [[]]) {
//     // Convert input data to a tensor
//     const inputTensor = tf.tensor2d(inputData);

//     // Make predictions
//     const predictions = model.predict(inputTensor);

//     // Convert predictions to readable format
//     const predictionValues = predictions.arraySync();
//     console.log('Predictions:', predictionValues);
//   }

//   makePredictions([[10]]).catch(console.error);
// });
