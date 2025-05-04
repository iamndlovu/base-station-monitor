import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TempContainer from '../tempContainer';
import SignalContainer from '../SignalContainer';
import FuelContainer from '../FuelContainer';
import Maintenance from '../Maintenance';
import ExtraInfo from '../Extra';
import DataTable from '../DataTable';
import Statistics from '../Statistics';
import AlarmBanner from '../AlarmBanner';
import Users from '../Users';

import styles from './Dashboard.module.scss';

const Dashboard = ({ user, logoutHandler }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataRes = await axios.get('http://localhost:5000/data');
        setData(dataRes.data);
      } catch (err) {
        console.error(`Failed to fetch data from server:\n\t\t${err}`);
      }
    };

    fetchData();

    const fetchDataPeriodically = setInterval(() => fetchData(), 5000);

    return () => {
      clearInterval(fetchDataPeriodically);
    };
  }, []);

  const { _id } = data[0]
    ? data[0]
    : {
        _id: `${Math.random()}${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDay()}`,
      };
  const temperature = data[0]
    ? data[0].temperature
    : {
        tempVal: null,
        l: null,
        ll: null,
        h: null,
        hh: null,
        max: null,
        min: null,
        fan: null,
      };

  const battery = data[0]
    ? data[0].battery
    : {
        ups: null,
        l: null,
        ll: null,
        h: null,
        hh: null,
        max: null,
        min: null,
        level: null,
      };

  const signal = data[0]
    ? data[0].signal
    : {
        strength: null,
        l: null,
        ll: null,
        h: null,
        hh: null,
        max: null,
        min: null,
      };

  const fuel = data[0]
    ? data[0].fuel
    : {
        generator: null,
        l: null,
        ll: null,
        h: null,
        hh: null,
        max: null,
        min: null,
        level: null,
      };

  const avgTemp = Number(
    (
      data
        .map((entry) => entry.temperature.tempVal)
        .reduce((a, b) => a + b, 0) / data.length
    ).toFixed(1)
  );

  const minTemp = Number(
    data
      .map((entry) => entry.temperature.tempVal)
      .reduce((a, b) => (a < b ? a : b), Infinity)
  );

  const maxTemp = Number(
    data
      .map((entry) => entry.temperature.tempVal)
      .reduce((a, b) => (a > b ? a : b), -Infinity)
  );
  const avgSignal = Number(
    (
      data.map((entry) => entry.signal.strength).reduce((a, b) => a + b, 0) /
      data.length
    ).toFixed(1)
  );
  const minSignal = Number(
    data
      .map((entry) => entry.signal.strength)
      .reduce((a, b) => (a < b ? a : b), Infinity)
  );
  const maxSignal = Number(
    data
      .map((entry) => entry.signal.strength)
      .reduce((a, b) => (a > b ? a : b), -Infinity)
  );

  const [showTable, setShowTable] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  const toggleTable = () => setShowTable((old) => !old);
  const toggleUsers = () => setShowUsers((old) => !old);

  return (
    <div className={styles.Dashboard}>
      <main className={styles.container}>
        {showTable && <DataTable data={data} toggle={toggleTable} />}

        {showUsers && <Users toggle={toggleUsers} />}

        {!showTable && !showUsers && (
          <>
            <section className={`${styles.sectionContainer} ${styles.alarms}`}>
              <AlarmBanner
                temperature={temperature}
                battery={battery}
                fuel={fuel}
                signal={signal}
              />
            </section>
            <section className={`${styles.sectionContainer} ${styles.temp}`}>
              <TempContainer temperature={temperature} />
            </section>
            <section className={`${styles.sectionContainer} ${styles.fuel}`}>
              <FuelContainer
                fuelVal={fuel.level}
                fuelLow={fuel.l}
                fuelLowLow={fuel.ll}
                fuelMax={fuel.max}
                fuelMin={fuel.min}
                generatorStatus={fuel.generator}
                headTxt={'generator fuel level'}
                equipTxt={'generator'}
              />
            </section>
            <section className={`${styles.sectionContainer} ${styles.battery}`}>
              <FuelContainer
                fuelVal={battery.level}
                fuelLow={battery.l}
                fuelLowLow={battery.ll}
                fuelMax={battery.max}
                fuelMin={battery.min}
                generatorStatus={battery.ups}
                headTxt={'UPS battery level'}
                equipTxt={'UPS'}
              />
            </section>
            <section className={`${styles.sectionContainer} ${styles.signal}`}>
              <SignalContainer
                id={_id}
                signalVal={signal.strength}
                min={signal.min}
                max={signal.max}
              />
            </section>

            <section className={`${styles.sectionContainer} ${styles.extra}`}>
              <ExtraInfo
                user={user}
                logoutHandler={logoutHandler}
                toggleTable={toggleTable}
                toggleUsers={toggleUsers}
              />
            </section>
          </>
        )}

        {(showTable || showUsers) && (
          <section className={`${styles.sectionContainer} ${styles.stats}`}>
            <Statistics
              avgTemp={avgTemp}
              minTemp={minTemp}
              maxTemp={maxTemp}
              avgSignal={avgSignal}
              minSignal={minSignal}
              maxSignal={maxSignal}
            />
          </section>
        )}

        <section className={`${styles.sectionContainer} ${styles.maint}`}>
          <Maintenance />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
