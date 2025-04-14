<template>
  <v-app>
    <!-- Header -->
    <Header />

    <!-- Menu -->
    <Menu />

    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Footer -->
    <!-- <Footer /> -->
  </v-app>
</template>

<script>
import Header from "@/components/Header.vue";
import Menu from "@/components/Menu.vue";
import Footer from "@/components/Footer.vue";

export default {
  components: {
    Header,
    Menu,
    Footer,
  },
};
</script>

<style>
/* Global styles */
</style>
