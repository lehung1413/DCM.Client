<template>
  <v-footer app color="grey darken-4" dark>
    <v-container>
      <v-row align="center" justify="space-between">
        <v-col cols="12" md="6" class="text-center text-md-start">
          &copy; {{ new Date().getFullYear() }} Dynamic Category Search
        </v-col>
        <v-col cols="12" md="6" class="text-center text-md-end">
          <v-btn icon>
            <v-icon>mdi-facebook</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-twitter</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-linkedin</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {};
</script>
