import { createStore } from "vuex";
import { Radio } from "../interfaces/radio";

// Typing of store
export type State = {
	radios: Radio[];
	selectedRadio: Radio;
};

// Export store
export default createStore({
	state: {
		radios: [] as Radio[],
		selectedRadio: null as null | Radio,
	},
	mutations: {
		fetchRadios(state, radios: Radio[]) {
			state.radios = radios;
		},
		selectRadio(state, radio) {
			state.selectedRadio = radio;
		},
	},
	actions: {
		async fetchRadios({ commit }) {
			const response = await fetch("/radios");
			const payload = await response.json();
			commit("fetchRadios", payload);
		},
		async selectRadio({ commit, state }, id) {
			const radiosCopy: Radio[] = state.radios;
			const selectedRadio = radiosCopy.find((radio) => radio.Id === id);
			commit("selectRadio", selectedRadio);
		},
	},
	getters: {
		radios(state) {
			return state.radios;
		},
	},
});
