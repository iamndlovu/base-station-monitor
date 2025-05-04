import React from 'react';
import AlarmListItem from './AlarmListItem';

import styles from './AlarmList.module.scss';

const AlarmList = ({ alarms }) => {
  return (
    <ul className={styles.AlarmList}>
      {alarms.map((item) => (
        <AlarmListItem alarm={item} key={`${item.param}-${item.msg}`} />
      ))}
    </ul>
  );
};

export default AlarmList;
