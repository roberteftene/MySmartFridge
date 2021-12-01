<template>
  <q-page class="flex-center">
    <div class="q-pa-md">
      <div class="row">
        <div class="landingLeft col">
          <h1 class="topHeading">
            My Smart
            <br />
            Fridge
          </h1>
          <div class="landingLeftSection">
            <span class="shortDescription">Designed for organizing you fridge as you wish. </span>
            <q-btn @click="goToRegister" class="actionBtn" style="width: 30%" text-color="white" label="Create Fridge" />
          </div>
        </div>
        <div class="col flex-center">
          <img class="landingImage" alt="Quasar logo" src="../assets/23311.jpg" style="width: 200px; height: 200px" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<style></style>

<script>
export default {
  name: "LandingComponent",
  methods: {
    goToRegister: function () {
      this.$router.push("/auth/register");
    },
  },
};
</script>

<style>
.topHeading {
  font-family: "Permanent Marker", cursive;
  color: #000000c2;
  font-size: 125px;
}
.landingLeft {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
}

.landingLeftSection {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}
.shortDescription {
  font-size: 16px;
  margin-bottom: 15px;
  font-family: Helvetica, sans-serif;
  color: #000000c2;
  font-weight: bold;
}
.actionBtn {
  background-color: #c13d3b;
  padding: 10px;
  border-radius: 8px;
  font-family: Helvetica;
  font-weight: 800;
  letter-spacing: 2px;
}
.q-pa-md .col .landingImage {
  width: 600px !important;
  height: 600px !important;
}
</style>
