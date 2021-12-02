<template>
  <div class="formContainer">
    <q-card class="formCard">
      <h1 class="formHeading">Create Fridge</h1>
      <q-input class="formInput" label="Fridge Nickname" v-model="formData.fridgeName" outlined type="text" />

      <q-btn @click="createFridge" class="registerBtn" style="width: 30%" text-color="white" label="Continue" />
    </q-card>
  </div>
</template>

<script>
import { ref } from "vue";
import cogoToast from "cogo-toast";
import axios from "axios";
export default {
  name: "FridgeCreationFormComponent",
  data() {
    return {
      formData: {
        fridgeName: ref(""),
      },
    };
  },
  methods: {
    validateFormData: function () {
      let isValid = false;
      if (this.formData.fridgeName === "") {
        cogoToast.error("All fields should be filled in.");
      } else {
        isValid = true;
      }
      return isValid;
    },
    createFridge: function () {
      if (this.validateFormData()) {
        let userLoggedIn = localStorage.getItem("userId");
        if (userLoggedIn === null) {
          cogoToast.error("Session expired! Please login again!");
          return;
        }
        let fridgeData = { ...this.formData };
        axios
          .post(process.env.VUE_APP_URL + "/fridges/create/" + userLoggedIn, fridgeData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          })
          .then(() => {
            cogoToast.success("Success!");
            this.$router.push("/home");
          })
          .catch(() => {
            cogoToast("Something went wrong!");
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
