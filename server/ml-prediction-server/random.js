// random.js
// This module provides functions to generate random integers and floats within a specified range.
/**
 * Generates a random integer between min (inclusive) and max (exclusive).
 * @param {number} min - The minimum value (inclusive).
 * @param {number} max - The maximum value (exclusive).
 * @returns {number} A random integer between min and max.
 */
function getRandomInt(min, max) {
  if (typeof min !== 'number' || typeof max !== 'number') {
    throw new Error('Both min and max must be numbers');
  }
  if (min >= max) {
    throw new Error('Min value must be less than max value');
  }
  return Math.floor(Math.random() * (max - min)) + min;
}
/**
 * Generates a random float between min (inclusive) and max (exclusive).
 * @param {number} min - The minimum value (inclusive).
 * @param {number} max - The maximum value (exclusive).
 * @returns {number} A random float between min and max.
 */

function getRandomFloat(min, max) {
  if (typeof min !== 'number' || typeof max !== 'number') {
    throw new Error('Both min and max must be numbers');
  }
  if (min > max) {
    throw new Error('Min value must be less than or equal to max value');
  }
  return Math.random() * (max - min) + min;
}

module.exports = {
  getRandomInt,
  getRandomFloat,
};
