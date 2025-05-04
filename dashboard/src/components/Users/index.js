import axios from 'axios';
import React, { useEffect, useState } from 'react';
import UserList from './UserList';

import styles from './Users.module.scss';
const Users = ({ toggle }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRes = await axios.get('http://localhost:5000/users');
        setUsers(usersRes.data);
      } catch (err) {
        console.error(`Failed to fetch users from server:\n\t\t${err}`);
      }
    };

    fetchUsers();

    const fetchUsersPeriodically = setInterval(() => fetchUsers(), 10000);

    return () => {
      clearInterval(fetchUsersPeriodically);
    };
  }, []);

  const deleteUser = async (id) => {
    try {
      const usersRes = await axios.delete(`http://localhost:5000/users/${id}`);

      if (usersRes.status === 200) {
        setUsers(usersRes.data);
        alert('User successfully deleted from database');
      } else throw new Error(usersRes.data);
    } catch (err) {
      console.error(`Failed to delete user from server:\n\t\t${err}`);
      alert(`Failed to delete user from server:\n\t\t${err}`);
    }
  };

  return (
    <section className={styles.container}>
      <button onClick={() => toggle()} className={styles.closeBtn}>
        X
      </button>

      <article className={styles.userListContainer}>
        <h1>system users</h1>
        <UserList users={users} deleteUser={deleteUser} />
      </article>
    </section>
  );
};

export default Users;
