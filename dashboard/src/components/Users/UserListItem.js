import axios from 'axios';

import styles from './UserListItem.module.scss';

const UserListItem = ({ user, deleteUser }) => {
  const { fullName, email, _id } = user;

  const confirmDelete = async () => {
    if (window.confirm(`You are about to dete user:\n     ${fullName}`)) {
      const superID = prompt('Enter super user ID:');
      try {
        const isIdCorrectRes = await axios.post(
          'http://localhost:5000/secreteID',
          {
            id: superID,
          }
        );
        const isIdCorrect = isIdCorrectRes.data;

        if (isIdCorrect) return deleteUser(_id);
        else alert('Incorrect ID.\n\tTry again.');
      } catch (error) {
        alert(`Failed to verify ID:\n\t${error}`);
      }
    }
    return false;
  };

  return (
    <li className={styles.UserListItem}>
      <section className={styles.details}>
        <table>
          <tbody>
            <tr className={styles.name}>
              <td>Full Name</td>
              <td>{fullName}</td>
            </tr>
            <tr className={styles.email}>
              <td>Email</td>
              <td>{email}</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section className={styles.actions}>
        <button className={styles.edit}>Edit</button>
        <button onClick={() => confirmDelete()} className={styles.delete}>
          Delete
        </button>
      </section>
    </li>
  );
};

export default UserListItem;
