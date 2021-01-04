import { createStore } from "vuex";
import { Radio } from "../interfaces/radio";

// Typing of store
export type State = {
	radios: Radio[];
};

// Export store
export default createStore({
	state: {
		radios: [] as Radio[],
	},
	mutations: {
		setRadios(state, payload: Radio[]) {
			state.radios = payload;
		},
	},
	actions: {
		async getRadios({ commit }) {
			const response = await fetch("/radios");
			const payload = await response.json();
			commit("setRadios", payload);
		},
	},
	getters: {
		radios(state) {
			return state.radios;
		},
	},
});
