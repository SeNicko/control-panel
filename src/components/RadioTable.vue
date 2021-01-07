<template>
	<section class="table">
		<div class="table__row table__row--header">
			<div class="table__cell table__cell--header">
				<h3 class="table__header">Name</h3>
				<input type="text" class="table__header-input" />
			</div>
			<div class="table__cell table__cell--header">
				<h3 class="table__header">Numer seryjny</h3>
				<input type="text" class="table__header-input" />
			</div>
			<div class="table__cell table__cell--header">
				<h3 class="table__header">Typ</h3>
				<input type="text" class="table__header-input" />
			</div>
			<div class="table__cell table__cell--header">
				<h3 class="table__header">Zasięg</h3>
				<input type="text" class="table__header-input" />
			</div>
			<div class="table__cell table__cell--header">
				<h3 class="table__header">Bateria</h3>
				<input type="text" class="table__header-input" />
			</div>
			<div class="table__cell table__cell--header">
				<h3 class="table__header">Tryb pracy</h3>
				<input type="text" class="table__header-input" />
			</div>
		</div>
		<div
			v-for="{ Id, Name, SerialNumber, BatteryLevel, WorkingMode, Strength, Type } in radios"
			:key="Id"
			class="table__row"
		>
			<div class="table__cell">
				<span>{{ Name }}</span>
			</div>
			<div class="table__cell">
				<span>{{ SerialNumber }}</span>
			</div>
			<div class="table__cell">
				<icon :icon="staticIcons.get(`Type-${Type}`)" class="table__icon" />
			</div>
			<div class="table__cell">
				<icon :icon="getSignalIcon(Strength)" :color="getColorFromPercentage(Strength * 10)" class="table__icon" />
			</div>
			<div class="table__cell">
				<icon :icon="getBatteryIcon(BatteryLevel)" :color="getColorFromPercentage(BatteryLevel)" class="table__icon" />
			</div>
			<div class="table__cell">
				<icon :icon="staticIcons.get(`WorkingMode-${WorkingMode}`)" class="table__icon" />
			</div>
		</div>
	</section>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { getColorFromPercentage } from "@/utils/percentage";
import { staticIcons, getBatteryIcon, getSignalIcon } from "@/utils/icons";

export default defineComponent({
	name: "Table",
	setup() {
		const store = useStore();
		const radios = computed(() => store.state.radios);

		return {
			radios,
			getColorFromPercentage,
			staticIcons,
			getBatteryIcon,
			getSignalIcon,
		};
	},
});
</script>

<style lang="scss" scoped>
$white: #fff;
$grey: #c0c0c0;
$rowHover: #d9f5e5;
$header: #62ca81;
$darkGrey: #3a3a3a;

.table {
	height: 40vh;
	background: $white;
	color: $darkGrey;

	&__row {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		padding: 0 50px;

		&--header {
			background: $header;
		}

		&:not(&--header) {
			cursor: pointer;
		}

		&:hover:not(&--header) {
			background: $rowHover;
		}
	}

	&__header {
		font-size: 20px;
		color: $white;

		&-input {
			outline: none;
			border: none;
			padding: 7px;
			border-radius: 5px;
			margin-top: 10px;
		}
	}

	&__cell {
		padding: 20px;
	}

	&__icon {
		font-size: 30px;
	}
}
</style>
