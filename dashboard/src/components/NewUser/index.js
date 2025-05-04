import { useState } from 'react';
import axios from 'axios';
import RegistrationForm from '../registrationForm/RegistrationForm';

import styles from './NewUser.module.scss';
import formStyles from '../loginForm/LoginForm.module.scss';

const NewUser = ({ toggleVisibility }) => {
  const [isIdCorrect, setIsIdCorrect] = useState(false);
  const [id, setId] = useState('');

  const onChangeID = (e) => setId(e.target.value);

  const checkID = async (e) => {
    e.preventDefault();

    const isIdCorrectRes = await axios.post('http://localhost:5000/secreteID', {
      id,
    });
    setId('');
    setIsIdCorrect(isIdCorrectRes.data);

    if (!isIdCorrectRes.data) alert('ERROR: \nWrong ID');
  };

  return (
    <div className={styles.NewUser}>
      <button onClick={() => toggleVisibility()} className={styles.closeBtn}>
        X
      </button>
      <section className={styles.container}>
        {isIdCorrect ? (
          <RegistrationForm />
        ) : (
          <form form className={formStyles.LoginForm} onSubmit={checkID}>
            <div className={formStyles.formGroup}>
              <label htmlFor='superID' className={formStyles.offscreen}>
                Enter Super User ID to proceed
              </label>
              <input
                type='password'
                name='superID'
                id='superID'
                placeholder='Super User ID'
                value={id}
                onChange={onChangeID}
                required
              />
            </div>
            <input type='submit' value='Submit' />
            <br />
            <br />
            <div>
              <span
                style={{
                  color: 'hsl(216, 96%, 40%)',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
                onClick={() => toggleVisibility()}
              >
                Exit
              </span>
            </div>
          </form>
        )}
      </section>
    </div>
  );
};

export default NewUser;
