<template>
  <div class="landing">
    <FridgeCreationFormComponent />
  </div>
</template>

<script>
import FridgeCreationFormComponent from "../components/FridgeCreationFormComponent.vue";

export default {
  name: "FridgeCreationView",
  components: {
    FridgeCreationFormComponent,
  },
};
</script>
