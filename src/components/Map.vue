<template>
	<div class="stats" v-if="selectedRadio">{{ selectedRadio.BatteryLevel }}% {{ selectedRadio.Strength }}</div>
	<div id="map" />
</template>

<script lang="ts">
import { useStore } from "vuex";
import { computed, defineComponent, onMounted, watch } from "vue";
import L, { LatLngExpression } from "leaflet";
import { convertToLatLon } from "@/utils/position";

export default defineComponent({
	name: "Map",
	setup() {
		// Acces store
		const store = useStore();
		// Get radios from store
		const radios = computed(() => store.state.radios);
		// Get selected radio from store
		const selectedRadio = computed(() => store.state.selectedRadio);
		// Create layer for radios markers
		const radiosMarkersLayer = L.layerGroup();
		// Define map
		let map: L.Map | null = null;

		// TODO: Create icon individual for each radio type

		const setMapFocus = (coords: L.LatLngExpression) => {
			if (map) map.panTo(coords);
		};

		// Radios markers update logic
		const updateRadiosMarkers = () => {
			radiosMarkersLayer.clearLayers(); // Remove old markers

			// Set new markers
			radios.value.forEach(({ Position, Id }) => {
				const icon = L.divIcon({
					className: "divIcon",
					html: "<i class='mdi mdi-map-marker' style='color: white'/>",
					iconSize: [30, 42],
					iconAnchor: [15, 42],
				});

				const position: L.LatLngExpression = convertToLatLon(Position);
				const marker = L.marker(position, { icon });

				marker.on("click", () => {
					store.dispatch("selectRadio", Id);
					setMapFocus(marker.getLatLng());
				});

				radiosMarkersLayer.addLayer(marker);
			});
		};

		// Set markers as fast as possible
		updateRadiosMarkers();

		// Run update on radios change
		watch(
			() => radios.value,
			() => updateRadiosMarkers()
		);

		const initMap = () => {
			// Declare center of map (Warsaw)
			const center: LatLngExpression = [50.049683, 19.944544];

			const bounds = new L.LatLngBounds(new L.LatLng(-90.0, -180.0), new L.LatLng(90.0, 180.0));
			// Mount map in div and set center
			map = L.map("map", {
				maxBounds: bounds,
				maxBoundsViscosity: 1.0,
				minZoom: 3,
			}).setView(center, 12);

			// Load map tiles
			L.tileLayer(
				"https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2VuaWNrbyIsImEiOiJja2prN21waGk0NHlpMnFydTE2a20yeWQ2In0.DBzP0dtPhCwdlMtt9oVUig",
				{
					attribution: 'Map using <a href="https://mapbox.com/">mapbox</a>',
					noWrap: true,
				}
			).addTo(map);
		};

		// Wait for component mount
		onMounted(() => {
			initMap(); // Create map
			if (map) map.addLayer(radiosMarkersLayer); // Add markers to the map
		});

		return {
			selectedRadio,
		};
	},
});
</script>

<style lang="scss">
#map {
	background: #343332;
	width: 100vw;
	height: 60vh;
}

.divIcon {
	width: 30px;
	height: 30px;
	font-size: 30px;
}

.stats {
	width: 300px;
	height: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 5px;
	background: rgb(0, 0, 0);
	position: absolute;
	top: 20px;
	margin: auto;
	left: 0;
	right: 0;
	z-index: 9999;
	color: gray;
}
</style>
