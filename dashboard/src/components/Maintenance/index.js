import { useState, useEffect } from 'react';
import axios from 'axios';
import MaintenanceSection from './MaintenanceSection';

import styles from './Maintenance.module.scss';

const Maintenance = () => {
  const [assetList, setAssetList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataRes = await axios.get('http://localhost:5000/assets');
        setAssetList(dataRes.data);
      } catch (err) {
        console.error(`Failed to fetch assets from server:\n\t\t${err}`);
      }
    };
    setTimeout(() => fetchData(), 20000);
    const fetchAssetsPeriodically = setInterval(() => fetchData(), 300000);

    return () => {
      clearInterval(fetchAssetsPeriodically);
    };
  }, []);

  let lifeList = [],
    maintList = [];

  assetList &&
    assetList.forEach((asset) => {
      const { assetName, lifeSpan, maintenanceDue } = asset;
      lifeList.push({
        assetName,
        timeFrame: Math.floor(lifeSpan[lifeSpan.length - 1]),
      });
      maintList.push({
        assetName,
        timeFrame: Math.floor(maintenanceDue[maintenanceDue.length - 1]),
      });
    });

  return (
    <article className={styles.Maintenance}>
      <h1>Maintenance</h1>
      <section className={styles['life-span']}>
        <h3>Remaining Life</h3>
        <div>
          <MaintenanceSection assetList={lifeList} />
        </div>
      </section>

      <section className={styles['maintenance-due']}>
        <h3>Recommended Maintenance Time</h3>
        <div>
          <MaintenanceSection assetList={maintList} />
        </div>
      </section>
    </article>
  );
};

export default Maintenance;
