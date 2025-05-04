import React from 'react';

import styles from './tempContainer.module.scss';
import boxStyles from '../../box.module.scss';

const tempContainer = ({ temperature }) => {
  const { tempVal, fan, h, hh, min, max } = temperature;

  const phFillColor = (tempVal) => {
    if (tempVal < h) {
      return 'rgb(0, 255, 0)'; // Green
    } else if (tempVal < (hh + h) / 2) {
      return 'rgb(255, 255, 0)'; // Yellow
    } else if (tempVal < hh) {
      return 'rgb(255, 165, 0)'; // Orange
    } else {
      return 'rgb(255, 0, 0)'; // Red
    }
  };

  const phFillStyle = {
    // backgroundColor: `rgb(${100 - (50 * tempVal) / 7}, 0, ${(50 * tempVal) / 7})`,
    backgroundColor: phFillColor(tempVal),
    height: `${(100 * tempVal) / (max - min)}%`,
  };

  return (
    <article className={styles.tempContainer}>
      <div className={styles.phTxt}>
        <span className={styles.phHead}>Temp:</span>
        <span className={styles.tempVal}>{tempVal}</span>
      </div>
      <div className={styles.phScale}>
        <span className={styles.phScaleCenterMark}></span>
        <span className={styles.phScaleFill} style={phFillStyle}></span>
      </div>
      <div className={styles.phAction}>
        <div>
          <span>Fan</span>
          <span
            className={
              fan
                ? `${boxStyles.box} ${boxStyles.success}`
                : `${boxStyles.box} ${boxStyles.default}`
            }
          ></span>
        </div>
      </div>
    </article>
  );
};

export default tempContainer;
