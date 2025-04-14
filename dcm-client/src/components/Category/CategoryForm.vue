<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        {{ category?.id ? "Edit Category" : "Add Category" }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field v-model="formData.name" label="Name" required />
          <v-text-field v-model="formData.location" label="Location" />
          <v-combobox
            v-model="formData.includeTags"
            label="Include Tags"
            multiple
          />
          <v-combobox
            v-model="formData.excludeTags"
            label="Exclude Tags"
            multiple
          />
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="formData.startDate"
                label="Start Date"
                readonly
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker v-model="formData.startDate" />
          </v-menu>
          <v-menu
            v-model="menuEnd"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="formData.endDate"
                label="End Date"
                readonly
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker v-model="formData.endDate" />
          </v-menu>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="saveCategory">Save</v-btn>
        <v-btn text @click="$emit('close')">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { createCategory, updateCategory } from "@/services/api";

export default {
  props: ["category"],
  data() {
    return {
      dialog: true,
      formData: {
        name: "",
        location: "",
        includeTags: [],
        excludeTags: [],
        startDate: "",
        endDate: "",
      },
      menu: false,
      menuEnd: false,
    };
  },
  watch: {
    category: {
      immediate: true,
      handler(newVal) {
        if (newVal) this.formData = { ...newVal };
      },
    },
  },
  methods: {
    async saveCategory() {
      if (this.category?.id) {
        await updateCategory(this.category.id, this.formData);
      } else {
        await createCategory(this.formData);
      }
      this.$emit("close");
    },
  },
};
</script>
