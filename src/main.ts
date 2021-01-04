import "@mdi/font/css/materialdesignicons.css";
import { createApp } from "vue";
import App from "./App.vue";

import Icon from "@/components/Icon.vue";

createApp(App)
	.component("I", Icon)
	.mount("#app");
