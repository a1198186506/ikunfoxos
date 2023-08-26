import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router";
import PrimeVue from "primevue/config";
import "primevue/resources/themes/lara-light-indigo/theme.css";
import ElementPlus from "element-plus";
import "element-plus/theme-chalk/index.css";
import { createPinia } from "pinia";
const pinia = createPinia();

// import "element-plus/es/components/breadcrumb-item/style/css";

createApp(App)
  .use(router)
  .use(PrimeVue)
  // .use(Breadcrumb)
  .use(ElementPlus)
  .use(pinia)
  .mount("#app");

//console.log(window.electronAPI);
//window.electronAPI.setTitle("ok");
