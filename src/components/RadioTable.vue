<template>
	<table class="table">
		<thead>
			<tr class="table__row table__row--header">
				<th v-for="header in headers" :key="header" class="table__field table__field--header">
					<span>
						{{ header }}
					</span>
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="radio in radiosTableData" :key="radio.Id" class="table__row">
				<td v-for="(value, key, index) in radio" :key="index" class="table__field">
					<I v-if="key === 'Type' || key === 'WorkingMode'" :icon="staticIcons.get(`${key}-${value}`)" />
					<I v-else-if="key === 'BatteryLevel'" :icon="getBatteryIcon(value)" :color="getColorFromPercentage(value)" />
					<I v-else-if="key === 'Strength'" :icon="getSignalIcon(value)" :color="getColorFromPercentage(value * 10)" />
					<span v-else>{{ value }}</span>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { getColorFromPercentage } from "@/utils/percentage";
import { staticIcons, getBatteryIcon, getSignalIcon } from "@/utils/icons";

export default defineComponent({
	name: "Table",
	setup() {
		// Gain access to the vuex store
		const store = useStore();

		// Get radios from store
		const radios = computed(() => store.state.radios);

		// Declare table of headers for easier html rendering
		const headers = ["nazwa", "numer seryjny", "typ", "sygnał", "bateria", "tryb"];

		// Get data for table (without Position and Id)
		const radiosTableData = computed(() =>
			radios.value.map(({ Name, Type, SerialNumber, Strength, BatteryLevel, WorkingMode }) => {
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

<style lang="scss" scoped>
.table {
	border-collapse: collapse;

	&__row {
	}

	&__field {
		text-align: center;
		margin: 25px 0;
	}
}
</style>
