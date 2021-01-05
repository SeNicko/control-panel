<template>
	<div class="app">
		<Map />
		<radio-table />
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useStore } from "vuex";
import RadioTable from "./components/RadioTable.vue";
import Map from "./components/Map.vue";

export default defineComponent({
	name: "App",
	components: {
		RadioTable,
		Map,
	},
	setup() {
		// Get access to store
		const store = useStore();

		const fetchRadiosData = async () => {
			try {
				await store.dispatch("getRadios");
			} catch (err) {
				//TODO: Handle error
			}

			setTimeout(fetchRadiosData, 5 * 1000);
		};

		onMounted(() => {
			fetchRadiosData();
		});
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
