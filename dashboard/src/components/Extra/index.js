import React, { useState } from 'react';
import NewUser from '../NewUser';
import Training from '../MLTraining';

import styles from './Extra.module.scss';

const ExtraInfo = ({ user, logoutHandler, toggleTable, toggleUsers }) => {
  let { fullName } = user;
  !fullName && (fullName = 'unknown');

  const [showReg, setShowReg] = useState(false);

  const toggleVisibility = () => setShowReg(false);

  return (
    <>
      <article className={styles.Extra}>
        <header>
          <div>
            <h1>base station monitor</h1>
            <h1>
              <sup>BY JAMES JANA</sup>
            </h1>
          </div>
          <p>
            <span>
              Logged in as: <span>{fullName.toLowerCase()}</span>
            </span>
            <span>
              <button onClick={() => logoutHandler()}>logout</button>
            </span>
          </p>
        </header>
        <menu>
          <nav>
            <ul>
              <li>
                <button onClick={() => toggleTable()}>historical data</button>
              </li>
              <li>
                <button onClick={() => toggleUsers()}>system users</button>
              </li>
              <li>
                <button onClick={() => setShowReg(true)}>add user</button>
              </li>
              <li className={styles.training} style={{ position: 'relative' }}>
                <Training />
              </li>
            </ul>
          </nav>
        </menu>
      </article>
      {showReg && <NewUser toggleVisibility={toggleVisibility} />}
    </>
  );
};

export default ExtraInfo;
