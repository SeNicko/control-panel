<template>
	<table>
		<tr>
			<th v-for="header in headers" :key="header">
				{{ header }}
			</th>
		</tr>
		<tr v-for="radio in radiosTableData" :key="radio.Id">
			<td v-for="(value, key, index) in radio" :key="index">
				<I v-if="key === 'Type' || key === 'WorkingMode'" :icon="staticIcons.get(`${key}-${value}`)" />
				<I
					v-else-if="key === 'BatteryLevel'"
					:icon="getBatteryIcon(value, 'battery')"
					:color="getColorFromPercentage(value)"
				/>
				<I
					v-else-if="key === 'Strength'"
					:icon="getSignalIcon(value, 'network-strength')"
					:color="getColorFromPercentage(value * 10)"
				/>
				<span v-else>{{ value }}</span>
			</td>
		</tr>
	</table>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";

import { Radio } from "../interfaces/radio";
import { getColorFromPercentage } from "@/utils/percentage";

export default defineComponent({
	name: "Table",
	props: {
		radios: Array as PropType<Radio[]>,
	},
	setup(props) {
		// Declare table of headers for easier html rendering
		const headers = ["nazwa", "numer seryjny", "typ", "sygnał", "bateria", "tryb"];

		// Get data for table (without Position and Id)
		const radiosTableData = computed(() =>
			props.radios?.map(({ Name, Type, SerialNumber, Strength, BatteryLevel, WorkingMode }) => {
				return {
					Name,
					SerialNumber,
					Type,
					Strength,
					BatteryLevel,
					WorkingMode,
				};
			})
		);

		const staticIcons = new Map<string, string>([
			["Type-Car", "taxi"],
			["Type-BaseStation", "domain"],
			["Type-Portable", "devices"],
			["WorkingMode-Voice", "account-voice"],
			["WorkingMode-Data", "database-export-outline"],
			["WorkingMode-Idle", "sleep"],
		]);

		const getBatteryIcon = (percentage: number, iconName: string): string => {
			if (percentage === 100) return iconName;
			else if (percentage === 0) return `${iconName}-outline`;
			else return `${iconName}-${Math.round(percentage / 10) * 10}`;
		};

		const getSignalIcon = (strength: number, iconName: string): string => {
			if (strength === 0) return `${iconName}-outline`;
			else return `${iconName}-${Math.round(strength / 2.5)}`;
		};

		return {
			headers,
			radiosTableData,
			getColorFromPercentage,
			staticIcons,
			getBatteryIcon,
			getSignalIcon,
		};
	},
});
</script>

<style lang="scss"></style>
