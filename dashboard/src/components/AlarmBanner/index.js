import React from 'react';
import Alarm from './Alarm';
import AlarmList from './AlarmList';

import styles from './AlarmBanner.module.scss';

const AlarmBanner = ({ signal, fuel, battery, temperature }) => {
  let alarms = [];

  // Temperature alarm checks
  if (temperature.tempVal >= temperature.hh)
    alarms.push(
      new Alarm('air conditioner', 'room temperature', 'very high', 'danger')
    );
  else if (temperature.tempVal >= temperature.h)
    alarms.push(
      new Alarm('air conditioner', 'room temperature', 'high', 'warning')
    );
  // Signal strength alarm checks
  if (signal.strength <= signal.ll)
    alarms.push(
      new Alarm('base repeater', 'transmission signal', 'very weak', 'danger')
    );
  else if (signal.strength <= signal.l)
    alarms.push(
      new Alarm('base repeater', 'transmission signal', 'weak', 'warning')
    );

  // Battery alarm checks
  if (battery.level <= battery.ll)
    alarms.push(new Alarm('UPS', 'battery level', 'critically low', 'danger'));
  else if (battery.level <= battery.l)
    alarms.push(new Alarm('UPS', 'battery level', 'low', 'warning'));

  // Fuel alarm checks
  if (fuel.level <= fuel.ll)
    alarms.push(
      new Alarm('generator', 'fuel level', 'critically low', 'danger')
    );
  else if (fuel.level <= fuel.l)
    alarms.push(new Alarm('generator', 'fuel level', 'low', 'warning'));

  return (
    <article className={styles.AlarmBanner}>
      <AlarmList alarms={alarms} />
    </article>
  );
};

export default AlarmBanner;
