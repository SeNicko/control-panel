// Import material design icons
import "@mdi/font/css/materialdesignicons.css";

import { createApp } from "vue";
import store from "./store";
import App from "./App.vue";
import Icon from "@/components/Icon.vue";

// Create app
createApp(App)
	.use(store)
	.component("I", Icon)
	.mount("#app");
