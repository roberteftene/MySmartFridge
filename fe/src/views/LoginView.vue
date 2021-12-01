<template>
  <div class="landing">
    <LoginFormComponent />
  </div>
</template>

<script>
import LoginFormComponent from "../components/LoginFormComponent.vue";

export default {
  name: "LoginView",
  components: {
    LoginFormComponent,
  },
};
</script>
