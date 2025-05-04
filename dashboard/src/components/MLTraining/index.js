import axios from 'axios';
import { useState } from 'react';

import alerts from '../../bootstrap-alarts.module.css';
import formStyles from '../loginForm/LoginForm.module.scss';
import styles from './Training.module.scss';

const Training = () => {
  const trainingEndponit = 'http://localhost:5001/train'; // -> GET
  const testingEndponit = 'http://localhost:8080'; // -> POST
  const defaultDiagnosticsTxt =
    'Click "Train" to start training the model. Click "Test Application" to geneerate random training data and test application funcionality. This may take a while.';

  const [diagnosticsTxt, setDiagnosticsTxt] = useState(defaultDiagnosticsTxt);
  const [isTraining, setIsTraining] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isTrained, setIsTrained] = useState(false);
  const [isTested, setIsTested] = useState(false);
  const [isError, setIsError] = useState(false);
  const [numberOfGeneratedEntries, setNumberOfGeneratedEntries] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const train = async () => {
    const response = await axios.get(trainingEndponit);
    const { data, status } = response;

    if (status === 200) {
      setIsTrained(true);
      setIsError(false);
    } else {
      setIsError(true);
    }
    setDiagnosticsTxt(
      `${data.message} ${data.models ? ': ' + data.models.join(', ') : ''}`
    );
  };

  const handleTrain = async () => {
    setIsTraining(true);
    setIsTrained(false);
    setIsError(false);
    setIsTesting(false);
    setIsTested(false);
    setDiagnosticsTxt('Training in progress...');

    try {
      await train();
    } catch (error) {
      console.error(error);
      setIsError(true);
      setDiagnosticsTxt('Error during training.' + String(error));
    } finally {
      setIsTraining(false);

      setTimeout(() => {
        setIsTrained(false);
        setIsError(false);
        setDiagnosticsTxt(defaultDiagnosticsTxt);
      }, 60000); // Reset after 60 seconds
    }
  };

  const handleTest = async () => {
    setIsTraining(false);
    setIsTrained(false);
    setIsError(false);
    setIsTesting(true);
    setIsTested(false);
    setDiagnosticsTxt('Generating testing data...');
    setShowModal(false);

    try {
      const response = await axios.post(testingEndponit, {
        count: numberOfGeneratedEntries,
      });
      const { data, status } = response;

      if (status === 200) {
        setIsTested(true);
        setIsError(false);
      } else {
        setIsTested(false);
        setIsError(true);
      }
      setDiagnosticsTxt(data.message);
    } catch (error) {
      console.error(error);
      setIsError(true);
      setDiagnosticsTxt('Error during testing.' + String(error));
    } finally {
      setIsTesting(false);

      setTimeout(async () => {
        setIsTested(false);
        setIsError(false);
        // setDiagnosticsTxt(defaultDiagnosticsTxt);
        setNumberOfGeneratedEntries(0);
        await handleTrain();
      }, 20000); // Reset after 20 seconds
    }
  };

  return (
    <>
      <section className={styles.Training}>
        <button className={styles.trainBtn} onClick={() => handleTrain()}>
          Train
        </button>
        <button className={styles.testBtn} onClick={() => setShowModal(true)}>
          Test Application
        </button>
        <p
          role='alert'
          className={`${styles.diagnostics} ${
            !isError &&
            !isTested &&
            !isTesting &&
            !isTrained &&
            !isTraining &&
            alerts['alert-light']
          } ${alerts.alert} ${
            (isTraining || isTesting) && alerts['alert-info']
          } ${isTrained && alerts['alert-success']} ${
            isError && alerts['alert-danger']
          } ${isTested && alerts['alert-warning']}`}
        >
          {diagnosticsTxt}
        </p>
      </section>

      {showModal && (
        <section className={`${styles.Training} ${styles.modal}`}>
          <form className={`${formStyles.LoginForm} ${styles.modalForm}`}>
            <button
              className={styles.closeBtn}
              onClick={() => setShowModal(false)}
            >
              X
            </button>
            <div className={`${formStyles.formGroup} ${styles.modalFormGroup}`}>
              <label htmlFor='numberOfGeneratedEntries'>
                Number of generated entries
              </label>
              <input
                type='number'
                min='1'
                max='100000'
                step='25'
                name='numberOfGeneratedEntries'
                id='numberOfGeneratedEntries'
                placeholder='Number of generated entries'
                value={numberOfGeneratedEntries}
                onChange={(e) => setNumberOfGeneratedEntries(e.target.value)}
                required
              />
            </div>
            <button
              type='button'
              className={styles.submitBtn}
              onClick={() => handleTest()}
            >
              Generate and Test
            </button>
          </form>
        </section>
      )}
    </>
  );
};

export default Training;
