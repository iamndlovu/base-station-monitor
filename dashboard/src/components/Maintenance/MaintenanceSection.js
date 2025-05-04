import React from 'react';

import styles from './MaintenanceSection.module.scss';

const MaintenanceSection = ({ assetList }) => {
  return (
    <ul className={styles.MaintenanceSection}>
      {assetList.map(({ assetName, timeFrame }) => (
        <li key={`${assetName}-${timeFrame}`}>
          <span>{assetName}: </span>
          <span>{timeFrame} days</span>
        </li>
      ))}
    </ul>
  );
};

export default MaintenanceSection;
