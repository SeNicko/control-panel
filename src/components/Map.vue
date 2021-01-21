<template>
  <div class="stats" v-if="selectedRadio">
    {{ selectedRadio.BatteryLevel }}% {{ selectedRadio.Strength }}
    {{ selectedRadio.SerialNumber }}
  </div>
  <div id="map" class="map" />
</template>

<script lang="ts">
import { useStore } from "vuex";
import { computed, defineComponent, onMounted, watch } from "vue";
import L, { LatLngExpression } from "leaflet";
import { convertToLatLon } from "@/utils/position";
import { staticIcons } from "@/utils/icons";
import { getColorFromPercentage } from "@/utils/percentage";
import { getDistance } from "@/utils/distance";

export default defineComponent({
  name: "Map",
  setup() {
    // Access store
    const store = useStore();
    // Get radios from store
    const radios = computed(() => store.state.radios);
    // Get selected radio from store
    const selectedRadio = computed(() =>
      store.state.radios.find((radio) => radio.Id === store.state.selectedRadio)
    );

    // Leaflet map layer for markers
    const radiosMarkersLayer = L.layerGroup();
    // Leaflet map layer for distance lines
    const radiosDistanceLayer = L.layerGroup();
    // Map holder
    let map: L.Map | null = null;

    // Selects radio with specified id
    const selectRadio = (radioId: number) => {
      store.commit("selectRadio", radioId); // Update store
    };

    // Set map focus to specified location
    const setMapFocus = (position: { Lat: string; Lon: string }) => {
      const cords: L.LatLngExpression = convertToLatLon(position);
      if (map) map.panTo(cords); // If map was created set focus to cords
    };

    // Update distance layer
    const updateDistanceLayer = () => {
      // Clear layer (Markers are movign)
      radiosDistanceLayer.clearLayers();

      // For each radio create distance line from it to selected radio cords
      radios.value.forEach(({ Position, Id }) => {
        if (selectedRadio.value && Id !== selectedRadio.value.Id) {
          const selectedRadioPosition = convertToLatLon(
            selectedRadio.value.Position
          );
          const currentRadioPosition = convertToLatLon(Position);
          // Create line
          const line = new L.Polyline(
            [selectedRadioPosition, currentRadioPosition],
            {
              color: "red",
              weight: 3,
              smoothFactor: 1,
            }
          );

          line.bindTooltip(
            `${getDistance(
              selectedRadioPosition,
              currentRadioPosition
            ).toString()} km`,
            { opacity: 1 }
          );

          // Add line to layer
          radiosDistanceLayer.addLayer(line);
        }
      });
    };

    // Update map markers
    const updateMarkersLayer = () => {
      // Clear layer (Markers are movign)
      radiosMarkersLayer.clearLayers();

      // For each radio create radio and add it to the markers layer
      radios.value.forEach(
        ({ Name, Position, Id, Type, BatteryLevel, Strength }) => {
          // Get icon name
          const iconName = staticIcons.get(`Type-${Type}`);
          // Get icon color
          const iconColor = getColorFromPercentage(
            (BatteryLevel + Strength * 10) / 2
          );
          // Create html for map marker
          const html = `<span class='mdi mdi-${iconName} mark ${
            selectedRadio.value?.Id === Id ? "mark--selected" : ""
          }' style='color: ${iconColor};'/>`;

          // Create marker
          const icon = L.divIcon({
            className: "divIcon",
            html,
            iconSize: [50, 50],
            iconAnchor: [25, 25],
          });

          // Get position string to floating point numbers
          const position: L.LatLngExpression = convertToLatLon(Position);
          // Create marker
          const marker = L.marker(position, { icon });
          marker.bindTooltip(Name, { opacity: 1 }).openTooltip();

          // On marker click select new radio and update everything
          marker.on("click", () => {
            selectRadio(Id);
          });

          // Add marker to markers layer
          radiosMarkersLayer.addLayer(marker);
        }
      );
    };

    // Watch for selected radio change
    watch(
      () => selectedRadio.value,
      (radio, prevRadio) => {
        // check if map or radio is undefined
        if (map && radio && radio.Id != prevRadio?.Id) {
          // Set map focus to newly selected radio
          setMapFocus(radio.Position);
          updateMarkersLayer();
          updateDistanceLayer();
        }
      }
    );

    // Watch for radios change
    watch(
      () => radios.value,
      () => {
        updateMarkersLayer();
        updateDistanceLayer();
      } // Updte markers
    );

    // Map creating logic
    const initMap = () => {
      // Set center of map
      const center: LatLngExpression = [50.049683, 19.944544];
      const bounds = new L.LatLngBounds(
        new L.LatLng(-90.0, -180.0),
        new L.LatLng(90.0, 180.0)
      );

      // Assign new map to
      map = L.map("map", {
        maxBounds: bounds,
        maxBoundsViscosity: 1.0,
        minZoom: 3,
      }).setView(center, 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
    };

    // On component mount
    onMounted(() => {
      updateMarkersLayer();
      initMap(); // Create map

      if (map) {
        map.addLayer(radiosMarkersLayer);
        map.addLayer(radiosDistanceLayer);
      } // Add markers layer to map
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
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: white;
  border-radius: 50%;
  background: rgb(0, 0, 0);
  width: 40px;
  height: 40px;
  padding: 10px;

  &--selected {
    border: 5px solid #ffffff;
  }
}

.stats {
  width: 300px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background: white;
  position: absolute;
  top: 20px;
  margin: auto;
  left: 0;
  right: 0;
  z-index: 9999;
}
</style>
