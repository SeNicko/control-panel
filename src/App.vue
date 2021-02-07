<template>
    <div class="app">
        <div v-if="fetchError" class="error">
            <p class="error__message">
                There was a problem with server connection
            </p>
        </div>
        <Map />
        <radio-table />
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import RadioTable from './components/RadioTable.vue';
import Map from './components/Map.vue';

export default defineComponent({
    name: 'App',
    components: {
        RadioTable,
        Map,
    },
    setup() {
        // Get access to store
        const store = useStore();
        const fetchError = ref(false);

        const fetchRadiosData = async () => {
            try {
                await store.dispatch('fetchRadios');
                fetchError.value = false;
            } catch (err) {
                fetchError.value = true;
            }

            setTimeout(fetchRadiosData, 5 * 1000);
        };

        onMounted(() => {
            fetchRadiosData();
        });

        return {
            fetchError,
        };
    },
});
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
}

.error {
    padding: 10px;
    position: absolute;
    background: #a53434;
    z-index: 999;
    width: 100vw;
    text-align: center;

    &__message {
        color: #e6e6e6;
    }
}
</style>
