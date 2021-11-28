<template>
  <q-layout id="app">
    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
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
