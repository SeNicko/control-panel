<template>
	<div id="map" />
</template>

<script lang="ts">
import { useStore } from "vuex";
import { computed, defineComponent, onMounted, watch } from "vue";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";

export default defineComponent({
	name: "Map",
	setup() {
		// Acces store
		const store = useStore();
		// Get radios from store
		const radios = computed(() => store.state.radios);
		// Create layer for radios markers
		const radiosMarkersLayer = L.layerGroup();

		const icon = L.divIcon({
			className: "divIcon",
			html: "	<i class='mdi mdi-map-marker' style='color: darkBlue'/>",
			iconSize: [30, 42],
			iconAnchor: [15, 42],
		});

		// Radios markers update logic
		const updateRadiosMarkers = () => {
			radiosMarkersLayer.clearLayers(); // Remove old markers

			// Set new markers
			radios.value.forEach(({ Position }) => {
				const lat = parseFloat(Position.Lat);
				const lon = parseFloat(Position.Lon);
				const marker = L.marker([lat, lon], { icon });

				marker.on("click", () => {
					console.log(Position);
				});

				radiosMarkersLayer.addLayer(marker);
			});
		};

		// Run update on radios change
		watch(
			() => radios.value,
			() => updateRadiosMarkers()
		);

		const initMap = (): L.Map => {
			// Declare center of map (Warsaw)
			const center: LatLngExpression = [50.049683, 19.944544];
			// Mount map in div and set center
			const map = L.map("map").setView(center, 7);

			// Load map tiles
			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			}).addTo(map);

			return map;
		};

		// Wait for component mount
		onMounted(() => {
			const map = initMap(); // Create map
			map.addLayer(radiosMarkersLayer); // Add markers to the map
		});
	},
});
</script>

<style lang="scss">
#map {
	width: 100vw;
	height: 60vh;
}

.divIcon {
	width: 30px;
	height: 30px;
	font-size: 30px;
}
</style>
