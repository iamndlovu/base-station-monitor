import React from 'react';

import styles from './Statistics.module.scss';

const Statistics = ({
  avgTemp,
  minTemp,
  maxTemp,
  avgSignal,
  minSignal,
  maxSignal,
}) => {
  return (
    <article className={styles.Statistics}>
      <h1>statistics</h1>
      <section>
        <h3>Temperature</h3>
        <div>
          <ul>
            <li>
              <span>Average</span>
              <span>{avgTemp}</span>
            </li>
            <div className={styles.line}></div>
            <li>
              <span>Minimum</span>
              <span>{minTemp}</span>
            </li>
            <div className={styles.line}></div>
            <li>
              <span>Maximum</span>
              <span>{maxTemp}</span>
            </li>
            <div className={styles.line}></div>
          </ul>
        </div>

        <h3>Transmitted Signal Strength</h3>
        <div>
          <ul>
            <li>
              <span>Average</span>
              <span>{avgSignal}</span>
            </li>
            <div className={styles.line}></div>
            <li>
              <span>Minimum</span>
              <span>{minSignal}</span>
            </li>
            <div className={styles.line}></div>
            <li>
              <span>Maximum</span>
              <span>{maxSignal}</span>
            </li>
            <div className={styles.line}></div>
          </ul>
        </div>
      </section>
    </article>
  );
};

export default Statistics;
