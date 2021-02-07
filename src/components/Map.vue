<template>
    <div id="map" class="map" />
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { computed, defineComponent, onMounted, watch } from 'vue';
import L, { LatLngExpression } from 'leaflet';
import { convertToLatLon } from '@/utils/position';
import { getDistance } from '@/utils/distance';
import { generateIconMarker } from '../utils/mapMarker';

export default defineComponent({
    name: 'Map',
    setup() {
        const store = useStore();
        const radios = computed(() => store.state.radios);
        const selectedRadio = computed(() =>
            store.state.radios.find(
                (radio) => radio.Id === store.state.selectedRadio
            )
        );

        const radiosDistanceLayer = L.layerGroup();
        const radiosMarkersLayer = L.layerGroup();
        let map: L.Map | null = null;

        // Set map focus to specified location
        const setMapFocus = (position: { Lat: string; Lon: string }) => {
            const cords: L.LatLngExpression = convertToLatLon(position);
            if (map) map.panTo(cords); // If map was created set focus to cords
        };

        const updateDistanceLayer = () => {
            // Clear layer before redraw
            radiosDistanceLayer.clearLayers();

            // Convert all readios position to LatLng
            const distances: [number, number][] = [];

            radios.value.forEach(({ Position, Id }) => {
                const currentRadioPosition = convertToLatLon(Position);
                distances.push(currentRadioPosition);
            });

            // If selected radio is not valid (don't have a name)
            if (selectedRadio.value && !selectedRadio.value.Name) {
                const selectedRadioPosition = convertToLatLon(
                    selectedRadio.value.Position
                );

                // Sort distances
                distances.sort(
                    (a, b) =>
                        getDistance(a, selectedRadioPosition) -
                        getDistance(b, selectedRadioPosition)
                );

                // Get two closest points
                for (let i = 0; i < 2; i++) {
                    // Create distance line
                    const line = new L.Polyline(
                        [selectedRadioPosition, distances[i]],
                        {
                            color: 'black',
                            weight: 2,
                            dashArray: '10',
                        }
                    );

                    // Add line to layer
                    radiosDistanceLayer.addLayer(line);
                }
            } else {
                // For each radio create distance line from it to selected radio cords
                radios.value.forEach(({ Position, Id }, i) => {
                    if (selectedRadio.value && Id !== selectedRadio.value.Id) {
                        const selectedRadioPosition = convertToLatLon(
                            selectedRadio.value.Position
                        );

                        // Create distance line
                        const line = new L.Polyline(
                            [selectedRadioPosition, distances[i]],
                            {
                                color: 'black',
                                weight: 2,
                                dashArray: '10',
                            }
                        );

                        radiosDistanceLayer.addLayer(line);
                    }
                });
            }
        };

        // Update map markers
        const updateMarkersLayer = () => {
            radiosMarkersLayer.clearLayers();

            // For each radio create radio and add it to the markers layer
            radios.value.forEach((radio) => {
                // Create marker
                const icon = L.divIcon({
                    className: 'divIcon',
                    html: generateIconMarker(radio, selectedRadio.value),
                    iconSize: [45, 45],
                    iconAnchor: [22.5, 22.5],
                });

                const position: L.LatLngExpression = convertToLatLon(
                    radio.Position
                );
                const marker = L.marker(position, { icon });

                if (radio.Name)
                    marker
                        .bindTooltip(radio.Name, { opacity: 1 })
                        .openTooltip();

                // On marker click select new radio and update everything
                marker.on('click', () => {
                    if (selectedRadio.value?.Id !== radio.Id) {
                        store.commit('selectRadio', radio.Id);
                    } else {
                        store.commit('deselectRadio');
                    }
                });

                radiosMarkersLayer.addLayer(marker);
            });
        };

        // Watch for selected radio change
        watch(
            () => selectedRadio.value,
            (radio, prevRadio) => {
                updateMarkersLayer();
                updateDistanceLayer();

                if (map && radio && radio.Id != prevRadio?.Id) {
                    setMapFocus(radio.Position);
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

        const initMap = () => {
            // Set center of map
            const center: LatLngExpression = [50.049683, 19.944544];
            const bounds = new L.LatLngBounds(
                new L.LatLng(-90.0, -180.0),
                new L.LatLng(90.0, 180.0)
            );

            map = L.map('map', {
                maxBounds: bounds,
                maxBoundsViscosity: 1.0,
                minZoom: 3,
            }).setView(center, 12);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);
        };

        // On component mount
        onMounted(() => {
            updateMarkersLayer();
            initMap();

            // Add markers layer to map
            if (map) {
                map.addLayer(radiosMarkersLayer);
                map.addLayer(radiosDistanceLayer);
            }
        });

        return {
            selectedRadio,
        };
    },
});
</script>

<style lang="scss">
.map {
    width: 100%;
    height: 60vh;
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

.marker {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: relative;

    &__icon {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        color: white;
        border-radius: 50%;
        background: white;
        width: 100%;
        height: 100%;
        padding: 10px;
        color: black;

        &--selected {
            background: white;
        }
    }

    &__distance {
        position: absolute;
        top: -40px;
        background: white;
        padding: 5px;
        border-radius: 10px;
    }
}
</style>
