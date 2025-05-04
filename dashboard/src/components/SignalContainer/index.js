import React from 'react';
import GuageChart from 'react-gauge-chart';

import styles from './SignalContainer.module.scss';

const SignalContainer = ({ id, signalVal, min, max }) => {
  return (
    <article className={styles.SignalContainer}>
      <div className={styles.signalTxt}>
        <span className={styles.signalHead}>signal strength:</span>
        <span className={styles.signalVal}>{signalVal}</span>
      </div>
      <GuageChart
        id={id}
        nrOfLevels={10}
        arcPadding={0.1}
        cornerRadius={3}
        colors={['#c30010', '#c30010', '#00FF00']}
        percent={signalVal / (max - min)}
        textColor='transparent'
        style={{ marginBottom: '3rem' }}
        animate={false}
      />
    </article>
  );
};

export default SignalContainer;
