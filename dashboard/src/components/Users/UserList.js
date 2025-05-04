import styles from './UserList.module.scss';
import UserListItem from './UserListItem';

const UserList = ({ users = [], deleteUser }) => {
  return (
    <ul className={styles.UserList}>
      {users.map((user) => (
        <UserListItem user={user} deleteUser={deleteUser} key={user._id} />
      ))}
    </ul>
  );
};

export default UserList;
