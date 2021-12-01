import { createRouter, createWebHistory } from "vue-router";

import LandingView from "../views/LandingView.vue";
import BasicLayout from "../layouts/BasicLayout.vue";
import RegisterView from "../views/RegisterView.vue";
import LoginView from "../views/LoginView.vue";

const routes = [
  {
    path: "/",
    name: "LandingView",
    component: LandingView,
    meta: { layout: BasicLayout },
  },
  {
    path: "/auth/register",
    name: "RegisterView",
    component: RegisterView,
    meta: { layout: BasicLayout },
  },
  {
    path: "/auth/login",
    name: "LoginView",
    component: LoginView,
    meta: { layout: BasicLayout },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
