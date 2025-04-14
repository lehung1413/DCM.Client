<template>
  <!-- <v-data-table :items="sessions" :headers="headers" :items-per-page="10" /> -->

  <v-card title="Preview Sessions">
    <!-- <template v-slot:text>
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
      ></v-text-field>
    </template> -->

    <v-data-table :headers="headers" :items="sessions" :search="search">
      <template v-slot:item.startDate="{ item }">
        <span>{{ new Date(item.startDate).toLocaleString() }}</span>
      </template>
      <template v-slot:item.endDate="{ item }">
        <span>{{ new Date(item.endDate).toLocaleString() }}</span>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    sessions: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const headers = [
      {
        align: "start",
        key: "title",
        sortable: true,
        title: "Title",
      },
      { key: "location", title: "Location" },
      { key: "startDate", title: "Start Date" },
      { key: "endDate", title: "End Date" },
      { key: "speakerName", title: "Speaker" },
      { key: "tags", title: "Tags" },
    ];

    return {
      headers,
    };
  },
});
</script>
