import { createStore } from "vuex";
import { Radio } from "../interfaces/radio";

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
			if(state.radios.find(radio => radio.Id === id))
				state.selectedRadio = id;
		},
	},
	actions: {
		async fetchRadios({ commit }) {
			const response = await fetch("/radios");
			const payload = await response.json();
			commit("fetchRadios", payload);
		},
	},
	getters: {},
});
