import { createStore } from 'vuex';
import { Radio } from '../interfaces/radio';

// Typing of store
export type State = {
    radios: Radio[];
    selectedRadio: number;
};

// Export store
export default createStore({
    state: {
        radios: [] as Radio[],
        selectedRadio: null as null | number,
    },
    mutations: {
        fetchRadios(state, radios: Radio[]) {
            state.radios = radios;
        },
        selectRadio(state, id) {
            // Be sure that radio with provided id exists
            if (state.radios.find((radio) => radio.Id === id))
                state.selectedRadio = id;
        },
        deselectRadio(state) {
            state.selectedRadio = null;
        },
    },
    actions: {
        async fetchRadios({ commit }) {
            const response = await fetch('/radios');

            if (!response.ok)
                throw new Error('There was a problem with a server connection');

            const payload = await response.json();
            commit('fetchRadios', payload);
        },
    },
    getters: {},
});
