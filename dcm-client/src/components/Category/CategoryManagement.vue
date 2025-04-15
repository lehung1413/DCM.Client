<template>
  <div class="category-management">
    <v-container>
      <!-- Dropdown to Select Category -->
      <v-card>
        <v-card-title>
          <h3>Select Category</h3>
        </v-card-title>
        <v-card-text
          ><v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="selectedCategory"
                :items="categories"
                item-text="name"
                item-value="categoryId"
                label="Select Category"
                @update:modelValue="loadCategory"
                single-line
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-btn
                color="error"
                @click="deleteCategoryById"
                v-if="selectedCategory"
              >
                Delete
              </v-btn>
            </v-col>
          </v-row></v-card-text
        >
      </v-card>

      <br />
      <!-- Confirmation Popup for Delete -->
      <v-dialog v-model="showDeletePopup" max-width="400">
        <v-card>
          <v-card-title>Confirm Delete</v-card-title>
          <v-card-text
            >Are you sure you want to delete this category?</v-card-text
          >
          <v-card-actions>
            <v-btn color="error" text @click="confirmDelete">Yes</v-btn>
            <v-btn text @click="cancelDelete">No</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Form for Create/Update Category -->
      <v-card>
        <v-card-title>
          {{ selectedCategory ? "Update Category" : "Create Category" }}
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveCategory">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="categoryForm.name"
                  label="Category Name"
                  required
                  :error="!!categoryNameError"
                  :error-messages="categoryNameError"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="categoryForm.description"
                  label="Description"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-divider />
            <br />
            <!-- Dynamic Search Conditions -->
            <h2>Search Conditions</h2>
            <v-row
              v-for="(condition, index) in categoryForm.categoryConditions"
              :key="index"
              class="condition"
              align="center"
            >
              <!-- Condition Operator -->
              <v-col cols="12" md="2">
                <v-select
                  v-if="index > 0"
                  v-model="condition.conditionOperator"
                  :items="['AND', 'OR']"
                  label="Condition Operator"
                ></v-select>
              </v-col>

              <!-- Field Name -->
              <v-col cols="12" md="2">
                <v-select
                  v-model="condition.fieldName"
                  :items="['Tag', 'Location', 'StartDate', 'EndDate']"
                  label="Field Name"
                  @change="updateConditionType(condition)"
                ></v-select>
              </v-col>

              <!-- Operator -->
              <v-col cols="12" md="2">
                <v-select
                  v-model="condition.operator"
                  :items="getOperators(condition.fieldName)"
                  label="Operator"
                ></v-select>
              </v-col>

              <!-- Value -->
              <v-col cols="12" md="4">
                <!-- <template> -->
                <!-- Tag Field -->
                <v-select
                  v-model="condition.valueString"
                  :items="tags"
                  item-text="value"
                  item-value="id"
                  label="Tags"
                  multiple
                  v-if="condition.fieldName === 'Tag'"
                ></v-select>

                <!-- Location Field -->
                <v-text-field
                  v-model="condition.valueString"
                  label="Location"
                  v-if="condition.fieldName === 'Location'"
                ></v-text-field>

                <!-- Date Fields -->
                <v-row
                  v-if="
                    condition.fieldName === 'StartDate' ||
                    condition.fieldName === 'EndDate'
                  "
                >
                  <!-- From Date -->
                  <v-col cols="6">
                    <v-text-field
                      v-model="condition.valueDateTimeFrom"
                      label="From (MM/dd/yyyy)"
                      placeholder="MM/dd/yyyy"
                      clearable
                      :error="!!condition.errors.valueDateTimeFrom"
                      :error-messages="condition.errors.valueDateTimeFrom"
                      @input="formatDate(condition, 'valueFrom')"
                      @blur="validateDate(condition, 'valueFrom')"
                    ></v-text-field>
                  </v-col>

                  <!-- To Date -->
                  <v-col cols="6">
                    <v-text-field
                      v-model="condition.valueDateTimeTo"
                      label="To (MM/dd/yyyy)"
                      placeholder="MM/dd/yyyy"
                      clearable
                      :error="!!condition.errors.valueDateTimeTo"
                      :error-messages="condition.errors.valueDateTimeTo"
                      @input="formatDate(condition, 'valueTo')"
                      @blur="validateDate(condition, 'valueTo')"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>

              <!-- Remove Condition -->
              <v-col cols="12" md="2">
                <v-btn color="error" @click.prevent="removeCondition(index)">
                  Remove
                </v-btn>
              </v-col>
            </v-row>
            <v-btn color="primary" @click.prevent="addCondition">
              Add Condition
            </v-btn>
          </v-form>
          <p v-if="conditionError" class="error-text">{{ conditionError }}</p>
        </v-card-text>

        <v-divider />
        <v-card-actions>
          <v-btn color="primary" @click.prevent="saveCategory">Save</v-btn>
          <v-btn color="secondary" @click.prevent="previewSessions">
            Preview Sessions
          </v-btn>
          <v-btn
            color="secondary"
            @click.prevent="searchSessions"
            :disabled="!selectedCategory"
          >
            Search Sessions
          </v-btn>
        </v-card-actions>
      </v-card>
      <br />
      <SessionTable :sessions="sessions" />
    </v-container>
    <v-dialog v-model="showSuccessDialog" max-width="400">
      <v-card>
        <v-card-title>Success</v-card-title>
        <v-card-text> The category has been saved successfully! </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="closeSuccessDialog">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
// import api from "@/services/api";
import SessionTable from "./PreviewSession.vue";
import {
  fetchCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchTags,
  fetchSessionsByCategory,
  fetchPreviewSessions,
} from "@/services/api";

const categories = ref([]);
const selectedCategory = ref(null);
const showDeletePopup = ref(false);
const categoryForm = ref({
  categoryId: null,
  name: "",
  description: "",
  categoryConditions: [],
});
const tags = ref([]);
const showSuccessDialog = ref(false);
const categoryNameError = ref("");
const conditionError = ref("");

const closeSuccessDialog = () => {
  showSuccessDialog.value = false;
};

const fetchCategoriesData = async () => {
  categories.value = (await fetchCategories()).map((category) => ({
    categoryId: category.categoryId,
    title: category.name,
  }));
};

const fetchTagsData = async () => {
  tags.value = await fetchTags();
};
const sessions = ref([]);

const fetchSessions = async () => {
  if (!selectedCategory.value) {
    alert("Please select a category first.");
    return;
  }

  try {
    sessions.value = await fetchSessionsByCategory(selectedCategory.value);
  } catch (error) {
    alert("Failed to fetch sessions. Please try again.");
  }
};

const fetchPreviewSessionsData = async () => {
  try {
    const data = {
      ...categoryForm.value,
      categoryConditions: categoryForm.value.categoryConditions.map(
        (condition) => ({
          ...condition,
          operatorId: getOperatorId(condition.operator),
          valueString: Array.isArray(condition.valueString)
            ? condition.valueString.join(",") // Convert array to JSON string
            : condition.valueString,
          valueDateTimeFrom: condition.valueDateTimeFrom
            ? parseToUTCDate(condition.valueDateTimeFrom) // Convert to Date object
            : null,
          valueDateTimeTo: condition.valueDateTimeTo
            ? parseToUTCDate(condition.valueDateTimeTo) // Convert to Date object
            : null,
        })
      ),
    };

    sessions.value = await fetchPreviewSessions(data);
  } catch (error) {
    alert("Failed to fetch sessions. Please try again.");
  }
};

const getCategoryForm = (category) => {
  // Populate categoryForm fields
  categoryForm.value.categoryId = category.categoryId;
  categoryForm.value.name = category.name || "";
  categoryForm.value.description = category.description || "";

  // Populate categoryConditions
  categoryForm.value.categoryConditions = category.categoryConditions.map(
    (condition) => ({
      categoryId: category.categoryId,
      conditionOperator: condition.conditionOperator,
      fieldName: condition.fieldName,
      operator: getOperatorById(condition.operatorId),
      operatorId: condition.operatorId,
      valueString:
        condition.fieldName === "Tag" && condition.valueString
          ? condition.valueString
              .split(",")
              .filter((d) => d != "")
              .map((id) => parseInt(id.trim()))
          : condition.valueString || "",
      valueDateTimeFrom: condition.valueDateTimeFrom
        ? formatToMMDDYYYY(condition.valueDateTimeFrom)
        : null,
      valueDateTimeTo: condition.valueDateTimeTo
        ? formatToMMDDYYYY(condition.valueDateTimeFrom)
        : null,
      errors: {
        valueDateTimeFrom: "",
        valueDateTimeTo: "",
      },
    })
  );
};

const loadCategory = async () => {
  if (!selectedCategory.value) {
    resetForm();
    return;
  }
  try {
    const category = await fetchCategoryById(selectedCategory.value);
    getCategoryForm(category);
  } catch (error) {
    console.error("Error loading category:", error);
    alert("Failed to load category. Please try again.");
  }
};

const getOperatorById = (operatorId) => {
  const operators = {
    1: "Contain",
    2: "Between",
    3: "Include",
    4: "Exclude",
    5: "Equal",
  };
  return operators[operatorId] || "";
};

const getOperatorId = (operatorName) => {
  const operators = {
    Contain: 1,
    Between: 2,
    Include: 3,
    Exclude: 4,
    Equal: 5,
  };
  return operators[operatorName] || null;
};

const resetForm = () => {
  categoryForm.value = {
    name: "",
    description: "",
    categoryConditions: [],
  };
};

const addCondition = () => {
  categoryForm.value.categoryConditions.push({
    conditionOperator: "AND",
    fieldName: "",
    operator: "",
    valueString: "",
    valueDateTimeFrom: null,
    valueDateTimeTo: null,
    datePicker: false,
    datePickerTo: false,
    errors: {
      valueDateTimeFrom: "",
      valueDateTimeTo: "",
    },
  });
};

const removeCondition = (index) => {
  categoryForm.value.categoryConditions.splice(index, 1);
};

const getOperators = (fieldName) => {
  if (fieldName === "Tag") {
    return ["Include", "Exclude"];
  } else if (fieldName === "Location") {
    return ["Contain"];
  } else if (fieldName === "StartDate" || fieldName === "EndDate") {
    return ["Between"];
  }
  return [];
};

const saveCategory = async () => {
  // Validate category name
  if (!categoryForm.value.name || categoryForm.value.name.trim() === "") {
    categoryNameError.value = "Category name is required.";
    return; // Stop the save operation
  } else {
    categoryNameError.value = ""; // Clear the error if valid
  }

  // Validate conditions
  if (categoryForm.value.categoryConditions.length === 0) {
    conditionError.value = "At least one condition is required.";
    return; // Stop the save operation
  } else {
    conditionError.value = ""; // Clear the error if valid
  }

  const data = {
    ...categoryForm.value,
    categoryConditions: categoryForm.value.categoryConditions.map(
      (condition) => ({
        ...condition,
        operatorId: getOperatorId(condition.operator),
        valueString: Array.isArray(condition.valueString)
          ? condition.valueString.join(",") // Convert array to JSON string
          : condition.valueString,
        valueDateTimeFrom: condition.valueDateTimeFrom
          ? parseToUTCDate(condition.valueDateTimeFrom) // Convert to Date object
          : null,
        valueDateTimeTo: condition.valueDateTimeTo
          ? parseToUTCDate(condition.valueDateTimeTo) // Convert to Date object
          : null,
      })
    ),
  };

  if (selectedCategory.value) {
    await updateCategory(selectedCategory.value, data);
  } else {
    await createCategory(data);
  }

  showSuccessDialog.value = true;
  loadCategory();
  fetchCategoriesData();
  resetForm();
};

const deleteCategoryById = () => {
  showDeletePopup.value = true;
};

const confirmDelete = async () => {
  await deleteCategory(selectedCategory.value);
  showDeletePopup.value = false;
  fetchCategoriesData();
  resetForm();
  showSuccessDialog.value = true;
};

const cancelDelete = () => {
  showDeletePopup.value = false;
};

const previewSessions = () => {
  fetchPreviewSessionsData(); // Fetch the session list for the selected category
};

const searchSessions = () => {
  fetchSessions(); // Fetch the session list for the selected category
};

const formatDate = (condition, field) => {
  let value = condition[field];

  value = value.replace(/\D/g, "");

  if (value.length >= 2) {
    value = value.slice(0, 2) + "/" + value.slice(2);
  }
  if (value.length >= 5) {
    value = value.slice(0, 5) + "/" + value.slice(5, 9);
  }

  if (value.length > 10) {
    value = value.slice(0, 10);
  }

  condition[field] = value;
};

const parseToUTCDate = (dateString) => {
  if (!dateString) return null;

  const [month, day, year] = dateString
    .split("/")
    .map((part) => parseInt(part, 10));
  return new Date(Date.UTC(year, month - 1, day)); // Month is 0-based in JavaScript
};

const formatToMMDDYYYY = (date) => {
  if (!date) return null; // Handle null or undefined dates
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Add leading zero to month
  const day = String(d.getDate()).padStart(2, "0"); // Add leading zero to day
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
};

const validateDate = (condition, field) => {
  const dateValue = condition[field];
  const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;

  if (!dateValue) {
    condition.errors[field] = "This field is required.";
  } else if (!dateRegex.test(dateValue)) {
    condition.errors[field] = "Invalid date format. Use MM/dd/yyyy.";
  } else {
    condition.errors[field] = ""; // Clear error if valid
  }
};

onMounted(() => {
  fetchCategoriesData();
  fetchTagsData();
});
</script>

<style scoped>
.condition {
  margin-bottom: 16px;
}
.error-text {
  color: red;
  font-size: 14px;
  margin-bottom: 8px;
}
</style>
