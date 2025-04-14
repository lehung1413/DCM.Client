<template>
  <v-navigation-drawer app permanent>
    <v-list density="compact" nav>
      <v-list-item
        v-for="item in menuItems"
        :key="item.value"
        :prepend-icon="item.icon"
        :title="item.title"
        :value="item.value"
        @click="navigate(item.route)"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    const menuItems = [
      { icon: "mdi-home", title: "Home", value: "home", route: "/" },
      {
        icon: "mdi-format-list-bulleted",
        title: "Categories",
        value: "categories",
        route: "/categories",
      },
    ];
    const navigate = (route) => {
      router.push(route);
    };

    return {
      menuItems,
      navigate,
    };
  },
};
</script>

<style scoped>
/* Optional: Add custom styles for the menu */
</style>
