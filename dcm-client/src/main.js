import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createVuetify } from "vuetify";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import api from "./services/api";

const vuetify = createVuetify({
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          primary: "#1976D2", // Blue
          secondary: "#424242", // Grey
          accent: "#82B1FF", // Light Blue
          error: "#FF5252", // Red
          info: "#2196F3", // Blue
          success: "#4CAF50", // Green
          warning: "#FFC107", // Yellow
        },
      },
    },
  },
});

const app = createApp(App);

// Đăng ký $api để sử dụng trong toàn bộ ứng dụng
app.config.globalProperties.$api = api;
app.use(router).use(vuetify).mount("#app");
