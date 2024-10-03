import { ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'

const myUser = defineStore("user", () => {
  const user = ref([]);
  const loggedInUserId = ref(localStorage.getItem('loggedInUserId'));

  const addUsers = (newUsers) => {
    newUsers.forEach((newUser) =>
      addUser(
        newUser.id,
        newUser.name,
        newUser.email,
        newUser.password,
      )
    );
  };

  const addUser = (id, name, email, password) => {
    user.value.push({
      id: id,
      name: name,
      email: email,
      password: password,
    });
  };

  const getUsers = () => {
    return user.value;
  };

  const setLoggedInUserId = (id) => {
    loggedInUserId.value = id;
    localStorage.setItem('loggedInUserId', id); 
  };

  const getLoggedInUserId = () => {
    return loggedInUserId.value;
  };

  const getUserById = (id) => {
    return user.value.find((u) => u.id === id);
  };

  const userLogout = () => {
    loggedInUserId.value = null;
    localStorage.removeItem('loggedInUserId'); 
  };


  return {
    addUser,
    addUsers,
    getUsers,
    setLoggedInUserId,
    getLoggedInUserId,
    getUserById,
    userLogout,
  };
});

export { myUser };

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(myUser, import.meta.hot));
}
