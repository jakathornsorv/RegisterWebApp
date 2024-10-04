<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { addItem } from "../libs/fetch"
import { myUser } from "../stores/userStore"

const router = useRouter()
const users = ref()
const userStore = myUser()
const email = ref("")
const password = ref("")

const showPassword = ref(false)

const formData = ref({
  username: "",
  email: "",
  password: "",
})

const closeModal = () => {
  my_modal_1.close()
}

const clearRegistrationForm = () => {
  formData.value.username = ""
  formData.value.email = ""
  formData.value.password = ""
}

const register = () => {
  if (!isValidFormData()) {
    alert("กรุณากรอกให้ครบ")
    return
  }
  const newUser = addItem(import.meta.env.VITE_USER_BASE_URL, {
    name: formData.value.name,
    email: formData.value.email,
    password: formData.value.password,
  })
  alert("ลงทะเบียนสำเร็จ")
  closeModal()
  clearRegistrationForm()
}

const isValidFormData = () => {
  const requiredFields = ["name", "email", "password"]
  for (const field of requiredFields) {
    if (!formData.value[field]) {
      return false
    }
  }
  return true
}

const loginUser = async () => {
  try {
    const response = await fetch(import.meta.env.VITE_USER_BASE_URL)
    if (!response.ok) {
      throw new Error("กรุณาลงทะเบียนก่อนเข้าใช้งานหรือเข้าสู่ระบบ Guest")
    }
    const data = await response.json()
    users.value = data
    userStore.getUsers(users.value)
  } catch (error) {
    console.error(error)
  }

  const user = users.value.find(
    (user) => user.email === email.value && user.password === password.value
  )
  if (user) {
    userStore.addUsers([user])
    userStore.setLoggedInUserId(user.id);
    router.push({ name: 'information' })
  } else {
    alert("อีเมลหรือรหัสผ่านผิด")
  }
}

const loginGuest = () => {
  router.push({ name: 'information' })
}

</script>
<template>
  <div class="full-page">
    <div class="box-center bg-black">
      <div class="form-container">
        <div class="title">
          <div class="mt-5 text-5xl text-white">Sign in</div>
        </div>
        <div class="form">
          <label class="input input-bordered flex items-center gap-2 m-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
              class="w-4 h-4 opacity-70"></svg>
            <input type="text" class="grow" v-model="email" placeholder="Email" />
          </label>
          <label class="input input-bordered flex items-center gap-2 m-2 mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
              class="w-4 h-4 opacity-70"></svg>
            <input :type="showPassword ? 'text' : 'password'" class="grow" v-model="password" placeholder="Password" />
            <input type="checkbox" v-model="showPassword" class="ml-2" />
          </label>

          <div class="buttons">
            <button type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" @click="loginGuest()">
              Guest
            </button>
            <button type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onclick="my_modal_1.showModal()">
              Register
            </button>
            <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" @click="loginUser()">
              Login
            </button>
          </div>
        </div>
      </div>

      <dialog id="my_modal_1" class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg">Register</h3>
          <label class="input input-bordered flex items-center gap-2 m-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
              class="w-4 h-4 opacity-70"></svg>
            <input type="text" class="grow" v-model="formData.name" placeholder="Name" />
          </label>
          <label class="input input-bordered flex items-center gap-2 m-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
              class="w-4 h-4 opacity-70"></svg>
            <input type="text" class="grow" v-model="formData.email" placeholder="Email" />
          </label>
          <label class="input input-bordered flex items-center gap-2 m-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
              class="w-4 h-4 opacity-70"></svg>
            <input v-model="formData.password" :type="showPassword ? 'text' : 'password'" class="grow"
              placeholder="Password" />
            <input type="checkbox" v-model="showPassword" class="ml-2" />
          </label>
          <div class="modal-action">
            <form @submit.prevent="register" method="dialog">
              <button class="btn m-2">Register</button>
            </form>
            <button class="btn m-2" @click="closeModal">Close</button>
          </div>
        </div>
      </dialog>
    </div>
  </div>
</template>

<style scoped>
.full-page {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2d2f30;
  
}

.box-center {
  width: 50%;
  height: 35%;
  padding: 40px;
  background-color: #000000;
  border-radius: 20px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
  display: flex;

}

.form-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.title {
  width: 30%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.form {
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.buttons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  justify-content: flex-end;
}

.modal-box {
  max-width: 400px;
}

.title {
  width: 30%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start; 
  margin-bottom: 20px; 
}

</style>
