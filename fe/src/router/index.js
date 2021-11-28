import { createRouter, createWebHistory } from "vue-router";

import LandingView from "../views/LandingView.vue";
import BasicLayout from "../layouts/BasicLayout.vue";

const routes = [
  {
    path: "/",
    name: "LandingView",
    component: LandingView,
    meta: { layout: BasicLayout },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
