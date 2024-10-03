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
    <div class="box-center">
      <div class="form-container">
        <div class="title">
          <div class="mt-5 text-2xl font-bold text-slate-950">ลงชื่อเข้าใช้</div>
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
            <button class="btn btn-outline btn-accent mr-5" @click="loginUser">
              Login
            </button>
            <button class="btn btn-outline btn-accent mr-5" @click="loginGuest()">
              Guest
            </button>
            <button class="btn" onclick="my_modal_1.showModal()">Register</button>
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
  height: auto;
  padding: 40px;
  background-color: #ffffff;
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
}

.modal-box {
  max-width: 400px;
}

</style>
