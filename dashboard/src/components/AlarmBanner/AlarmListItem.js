import React from 'react';
import styles from './AlarmListItem.module.scss';

const AlarmListItem = ({ alarm }) => {
  const { equip, param, msg, almClass } = alarm;

  return (
    <li className={`${styles.AlarmListItem} ${styles['alarm-' + almClass]}`}>
      <span>
        {equip}
        {' ->  '}
      </span>
      <span>
        <span>{param}</span>
        <span>{msg}</span>
      </span>
    </li>
  );
};

export default AlarmListItem;
