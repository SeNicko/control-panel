<template>
	<div id="map"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";

export default defineComponent({
	name: "Map",
	setup() {
		const initMap = () => {
			// Declare center of map (Warsaw)
			const center: LatLngExpression = [52.22977, 21.01178];

			// Init map
			const map = L.map("map").setView(center, 13);

			// Load map tiles
			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			}).addTo(map);
		};

		onMounted(() => {
			initMap();
		});
	},
});
</script>

<style lang="scss">
#map {
	width: 100vw;
	height: 60vh;
}
</style>
