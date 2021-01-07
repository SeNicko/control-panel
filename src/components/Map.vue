<template>
	<div class="stats" v-if="selectedRadio">
		{{ selectedRadio.BatteryLevel }}% {{ selectedRadio.Strength }} {{ selectedRadio.SerialNumber }}
	</div>
	<div id="map" class="map" />
</template>

<script lang="ts">
import { useStore } from "vuex";
import { computed, defineComponent, onMounted, watch } from "vue";
import L, { LatLngExpression } from "leaflet";
import { convertToLatLon } from "@/utils/position";
import { staticIcons } from "@/utils/icons";

export default defineComponent({
	name: "Map",
	setup() {
		const store = useStore();
		const radios = computed(() => store.state.radios);
		const selectedRadio = computed(() => store.state.radios.find((radio) => radio.Id === store.state.selectedRadio));
		const radiosMarkersLayer = L.layerGroup();
		let map: L.Map | null = null;

		const setMapFocus = (coords: L.LatLngExpression) => {
			if (map) map.panTo(coords);
		};

		// Radios markers update logic
		const updateRadiosMarkers = () => {
			radiosMarkersLayer.clearLayers();

			radios.value.forEach(({ Position, Id, Type }) => {
				const iconName = staticIcons.get(`Type-${Type}`);
				const html = `<span class='mdi mdi-${iconName} mark'/>`;

				const icon = L.divIcon({
					className: "divIcon",
					html,
					iconSize: [40, 40],
					iconAnchor: [20, 40],
				});

				const position: L.LatLngExpression = convertToLatLon(Position);
				const marker = L.marker(position, { icon });

				marker.on("click", () => {
					store.commit("selectRadio", Id);
					setMapFocus(marker.getLatLng());
				});

				radiosMarkersLayer.addLayer(marker);
			});
		};

		updateRadiosMarkers();

		watch(
			() => radios.value,
			() => updateRadiosMarkers()
		);

		const initMap = () => {
			const center: LatLngExpression = [50.049683, 19.944544];
			const bounds = new L.LatLngBounds(new L.LatLng(-90.0, -180.0), new L.LatLng(90.0, 180.0));

			map = L.map("map", {
				maxBounds: bounds,
				maxBoundsViscosity: 1.0,
				minZoom: 3,
			}).setView(center, 12);

			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			}).addTo(map);
		};

		onMounted(() => {
			initMap();
			if (map) map.addLayer(radiosMarkersLayer);
		});

		return {
			selectedRadio,
		};
	},
});
</script>

<style lang="scss">
$mapBackground: #343332;

.map {
	background: $mapBackground;
	width: 100%;
	height: 60vh;
}

.mark {
	font-size: 40px;
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
