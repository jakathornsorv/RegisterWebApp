<script setup>
import { ref, onMounted } from 'vue';
import { myUser } from "../stores/userStore";
import { useRouter } from "vue-router";
import {getItemById} from "../libs/fetch.js"

const userStore = myUser();
const router = useRouter();

const loggedInUserId = userStore.getLoggedInUserId();
const loggedInUser = userStore.getUserById(loggedInUserId);

const userItem = ref()

onMounted(async () => {
    const items = await getItemById(import.meta.env.VITE_USER_BASE_URL, loggedInUserId)
    userItem.value = items
})

const logout = () => {
    userStore.userLogout()
    router.push({ name: 'home' });
};

const formData = ref({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    file: null
});

const openModal = () => document.getElementById('modal').showModal();
const closeModal = () => document.getElementById('modal').close();

const handleFileUpload = (event) => {
    formData.value.file = event.target.files[0];
};

const submitForm = async () => {
    if (!formData.value.firstName || !formData.value.lastName || !formData.value.email || !formData.value.phone || !formData.value.file) {
        alert("กรุณากรอกให้ครบ");
        return;
    }
    try {
        await sendConfirmationEmail(formData.value.email);
        alert("การยืนยันของคุณสำเร็จเเล้วกรุณาตรวจสอบที่อีเมลของคุณ");
        closeModal();
    } catch (error) {
        console.error("Error sending email:", error);
        alert("เกิดข้อผิดพลาด");
    }
};

const sendConfirmationEmail = async (email) => {
    return Email.send({
        Host: "smtp.elasticemail.com",
        Username: "jakathorn2546@gmail.com",
        Password: "AAE6CCF9110BB109E1D8593377B2A7D88B0F",
        To: email,
        From: "jakathorn2546@gmail.com",
        Subject: "Confirmation Your Data",
        Body: `Dear ${formData.value.firstName},\n\nConfirmation Your Data.`
    });
};

</script>

<template>
    <div class="container">
        <div class="card bg-base-100 w-96 shadow-xl">
            <figure>
                <img src="https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_640.png" alt="sample" />
            </figure>
            <div class="card-body">
                <h2 class="card-title">ยินดีต้อนรับ</h2>
                <p>คุณ: {{ userItem?.name || 'Guest' }}</p>
                <p>email: {{ userItem?.email || 'Guest' }} </p>
                <div class="card-actions justify-end">
                    <button class="btn btn-primary" @click="logout()">ออกจากระบบ</button>
                    <button class="btn" @click="openModal()">สมัครงาน</button>
                    <dialog id="modal" class="modal">
                        <div class="modal-box w-11/12 max-w-5xl">
                            <h3 class="text-lg font-bold">แบบฟอร์มสมัครงาน</h3>
                            <form @submit.prevent="submitForm()" class="form-vertical">
                              <input v-model="formData.firstName" placeholder="First Name" class="input-field" required />
                              <input v-model="formData.lastName" placeholder="Last Name" class="input-field" required />
                              <input v-model="formData.email" type="email" placeholder="Email" class="input-field" required />
                              <input v-model="formData.phone" placeholder="Phone" class="input-field" required />
                              <input type="file" @change="handleFileUpload" class="input-field" required />
                              <div class="modal-action">
                                <button type="submit" class="btn">Submit</button>
                                <button type="button" class="btn" @click="closeModal()">Close</button>
                            </div>
                            </form>
                        </div>
                    </dialog>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #2a2929;
}

.form-vertical {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.input-field {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
}
</style>
