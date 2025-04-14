import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/pages/Home.vue";
import CategoriesPage from "@/pages/CategoriesPage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/categories",
    name: "Categories",
    component: CategoriesPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
