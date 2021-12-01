<template>
  <q-layout id="app">
    <div class="q-pa-md">
      <q-toolbar
        style="font-family: Helvetica; letter-spacing: 1.5px; font-weight: bold"
        class="navbar bg-purple text-white shadow-2 rounded-borders"
      >
        <q-btn flat label="My Smart Fridge" />
        <q-space />
        <q-tabs v-model="tab" shrink>
          <q-tab name="tab1" label="Register" />
          <q-tab name="tab2" label="Sign In" />
        </q-tabs>
      </q-toolbar>
    </div>
    <q-page-container class="pageContainer">
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    return {
      tab: ref(""),
    };
  },
  data() {
    return {
      items: [
        { label: "Home", icon: "pi pi-fw pi-home", to: "/" },
        { label: "Authentication", icon: "pi pi-fw pi-cog", to: "/auth" },
      ],
    };
  },
  components: {},
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap");
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #1b1c1e;
  width: 100%;
  height: 100%;
}

.q-pa-md .navbar {
  background-color: #4a4b4d !important;
}

.navbar span {
  font-weight: 600;
  font-size: 18px;
  letter-spacing: 2.5px;
  font-family: "Permanent Marker", cursive;
}

.navbar .q-tab__label {
  font-weight: 700;
}

.pageContainer {
  width: 100%;
}
</style>
