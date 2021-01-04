<template>
	<div class="app">
		<radio-table />
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useStore } from "vuex";
import RadioTable from "./components/RadioTable.vue";

export default defineComponent({
	name: "App",
	components: {
		RadioTable,
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
		};

		onMounted(() => {
			fetchRadiosData();
			setInterval(() => {
				fetchRadiosData();
			}, 5 * 1000);
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
