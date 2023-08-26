import { createRouter, createWebHashHistory } from "vue-router";
import MainPage from "../pages/MainPage.vue";
import SecondPage from "../pages/SecondPage.vue";
import PageNavigation from "../components/PageNavigation.vue";
import NormalCrawlerPage from "../pages/NormalCrawlerPage.vue";
import DataPresentationPage from "../pages/DataPresentationPage.vue";

const routes = [
  { path: "/", components: { MainPage, PageNavigation } },
  { path: "/SecongPage", components: { SecondPage, PageNavigation } },
  {
    path: "/NormalCrawlerPage",
    components: { NormalCrawlerPage, PageNavigation },
  },
  {
    path: "/DataPresentationPage",
    components: { DataPresentationPage, PageNavigation },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

//导出router
export default router;
