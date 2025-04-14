<template>
  <v-container>
    <h1>Category Management</h1>
    <v-divider class="mb-4"></v-divider>

    <CategoryManagement />
  </v-container>
</template>

<script>
import CategoryManagement from "@/components/Category/CategoryManagement.vue";

export default {
  components: {
    CategoryManagement,
  },
};
</script>
