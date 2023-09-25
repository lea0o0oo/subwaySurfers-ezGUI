import { createRouter, createWebHistory } from "vue-router";

import NotFoundPage from "./pages/NotFound.vue";

import Main from "./pages/Main.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Main },

    { path: "/:pathMatch(.*)*", component: NotFoundPage },
  ],
});
