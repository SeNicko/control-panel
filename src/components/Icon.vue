<template>
	<div class="mdi" :class="`mdi-${icon}`" :style="{ color: color ? color : 'black' }" />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "Icon",
	props: {
		icon: String,
		color: String,
	},
});
</script>
