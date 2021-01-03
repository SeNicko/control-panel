<template>
	<table>
		<tr>
			<th v-for="header in headers" :key="header">
				{{ header }}
			</th>
		</tr>
		<tr v-for="radio in radiosData" :key="radio.Id">
			<th v-for="(value, key, index) in radio" :key="index">
				{{ value }}
			</th>
		</tr>
	</table>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, computed } from "vue";

interface Radio {
	Id: number;
	Name: string;
	Type: string;
	SerialNumber: string;
	Strength: number;
	BatteryLevel: number;
	WorkingMode: string;
	Position?: {
		Lat: string;
		Lon: string;
	};
}

export default defineComponent({
	name: "Table",
	props: {
		radios: Array as PropType<Radio[]>,
	},
	setup(props) {
		const headers = ["id", "nazwa", "typ urządzenia", "numer seryjny", "siła sygnału", "poziom bateri", "tryb pracy"];

		const radiosData = computed(() =>
			props.radios?.map((radio) => {
				delete radio.Position;
				return radio;
			})
		);

		return {
			headers,
			radiosData,
		};
	},
});
</script>

<style lang="scss"></style>
