<template>
	{{ radios }}
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { apiUri } from "./config/api";

export default defineComponent({
	name: "App",
	setup() {
		// Local state
		const radios = ref([]);

		// Get all radios from api
		const getAllDevices = async () => {
			try {
				const response = await fetch("/radios");
				const data = await response.json();
				radios.value = data;
			} catch (err) {
				// TODO: handle in ui
				console.error("An error has occured", err);
			}
		};

		onMounted(() => {
			// Fetch radios on app load
			getAllDevices();
		});

		return {
			// Return radios in order to acces them in component body
			radios,
		};
	},
});
</script>

<style lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
