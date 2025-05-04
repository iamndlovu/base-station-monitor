import React from 'react';

import styles from './FuelContainer.module.scss';
import boxStyles from '../../box.module.scss';

const FuelContainer = ({
  fuelVal,
  fuelLow,
  fuelLowLow,
  fuelMin,
  fuelMax,
  generatorStatus,
  headTxt,
  equipTxt,
}) => (
  <article className={styles.FuelContainer}>
    <div className={styles.fuelTxt}>
      <span className={styles.fuelHead}>{headTxt}:</span>
      <span className={styles.fuelVal}>{fuelVal}</span>
    </div>
    <div className={styles.fuelScale}>
      <span className={styles.fuelScaleCenterMark}></span>
      <span
        className={styles.fuelScaleFill}
        style={(() => {
          if (fuelVal > fuelLow)
            return {
              backgroundColor: 'rgb(12, 245, 12)',
              width: `${(fuelVal / (fuelMax - fuelMin)) * 100}%`,
            };
          else if (fuelVal <= fuelLowLow)
            return {
              backgroundColor: 'rgb(255, 10, 12)',
              width: `${(fuelVal / (fuelMax - fuelMin)) * 100}%`,
            };
          else
            return {
              backgroundColor: 'rgb(251, 255, 10)',
              width: `${(fuelVal / (fuelMax - fuelMin)) * 100}%`,
            };
        })()}
      ></span>
    </div>
    <div className={styles.fuelAction}>
      <div>
        <span>{equipTxt}</span>
        <span
          className={
            generatorStatus
              ? `${boxStyles.box} ${boxStyles.success}`
              : `${boxStyles.box} ${boxStyles.default}`
          }
        ></span>
      </div>
    </div>
  </article>
);

export default FuelContainer;
