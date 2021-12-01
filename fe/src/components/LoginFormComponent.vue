<template>
  <div class="formContainer">
    <q-card class="formCard">
      <h1 class="formHeading">Log In</h1>

      <q-input class="formInput" label="Email" v-model="formData.email" outlined type="email" />
      <q-input
        class="formInput"
        label="Password"
        v-model="formData.password"
        outlined
        :type="isPwd ? 'password' : 'text'"
        hint="Enter a strong password"
      >
        <template v-slot:append>
          <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
        </template>
      </q-input>

      <q-btn @click="login" class="registerBtn" style="width: 30%" text-color="white" label="Log In" />
    </q-card>
  </div>
</template>

<script>
import { ref } from "vue";
import cogoToast from "cogo-toast";
import { regex_email } from "../utils/validations";
import axios from "axios";
export default {
  name: "RegisterFormComponent",
  setup() {
    return {
      isPwd: ref(true),
      isPwdConfirm: ref(true),
    };
  },
  data() {
    return {
      formData: {
        email: ref(""),
        password: ref(""),
      },
    };
  },
  methods: {
    validateFormData: function () {
      let isValid = false;
      if (this.formData.password === "" || this.formData.email === "") {
        cogoToast.error("All fields should be filled in.");
      } else if (!this.formData.email.match(regex_email)) {
        cogoToast.error("Email should have a proper format");
      } else {
        isValid = true;
      }
      return isValid;
    },
    login: function () {
      if (this.validateFormData()) {
        let userData = { ...this.formData };
        delete userData.confirmPassword;
        axios
          .post(process.env.VUE_APP_URL + "/auth/signin", userData)
          .then((res) => {
            cogoToast.success("Success!");
            localStorage.setItem("userToken", res.data.token);
            localStorage.setItem("userId", res.data.userId);
            this.$router.push("/home");
          })
          .catch((err) => {
            cogoToast("Error! " + err.message);
          });
      }
    },
  },
};
</script>

<style>
.formContainer {
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: #64686b;
  padding: 2%;
  min-height: 100vh;
}

.formHeading {
  font-size: 28px;
  font-family: "Permanent Marker", cursive;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 1px;
  color: #64686b;
}
.registerBtn {
  margin-top: 30px;
  margin-bottom: 30px;
  background-color: #64686b;
}
.formCard {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.formContainer .formCard .formInput {
  width: 50%;
  padding: 10px 10px 35px 10px !important;
}
</style>
