<template>
	<div class="app">
		<radio-table :radios="radios" />
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import RadioTable from "./components/RadioTable.vue";

export default defineComponent({
	name: "App",
	components: {
		RadioTable,
	},
	setup() {
		RadioTable; // Local state
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
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap");

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	font-family: "Roboto", sans-serif;
}
</style>
