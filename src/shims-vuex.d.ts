import { Store } from "vuex";
import { State } from "./store";

declare module "vuex" {
	export function useStore(key?: string): Store<State>;
}
