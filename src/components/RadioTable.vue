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
		</tbody>
	</table>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { getColorFromPercentage } from "@/utils/percentage";

export default defineComponent({
	name: "Table",
	setup() {
		// Gain access to the vuex store
		const store = useStore();

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
			strength = Math.round(strength / 2.5);
			if (strength === 0) return `${iconName}-outline`;
			else return `${iconName}-${strength}`;
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
