<template>
  <section class="list">
    <nav class="list__row list__row--header">
      <div class="list__cell">
        <span>Nazwa</span>
        <input type="text" v-model="query.Name" />
      </div>
      <div class="list__cell">
        <span>Numer seryjny</span>
        <input type="text" v-model="query.SerialNumber" />
      </div>
      <div class="list__cell">
        <span>Typ</span>
        <select name="" id="" v-model="query.Type">
          <option value=""></option>
          <option value="BaseStation">Stacja</option>
          <option value="Car">Auto</option>
          <option value="Portable">Urządzenie przenośne</option>
        </select>
      </div>
      <div class="list__cell">
        <span>Zasięg</span>
        <select name="" id="" v-model="query.Strength">
          <option :value="false">Rosnąco</option>
          <option :value="true">malejąco</option>
        </select>
      </div>
      <div class="list__cell">
        <span>Bateria</span>
        <select name="" id="" v-model="query.BatteryLevel">
          <option :value="false">Rosnąco</option>
          <option :value="true">malejąco</option>
        </select>
      </div>
      <div class="list__cell">
        <span>Tryb</span>
        <select name="" id="" v-model="query.WorkingMode">
          <option value=""></option>
          <option value="Idle">Uśpienie</option>
          <option value="Voice">Rozmowa</option>
          <option value="Data">Wysył danych</option>
        </select>
      </div>
    </nav>
    <div
      v-for="{
        Id,
        Name,
        SerialNumber,
        BatteryLevel,
        WorkingMode,
        Strength,
        Type,
      } in radios"
      :key="Id"
      class="list__row"
      @click="selectRadio(Id)"
      :class="{ 'list__row--selected': Id === selectedRadio?.Id }"
    >
      <div class="list__cell">
        <span>{{ Name === "" ? "CRITICAL!" : Name }}</span>
      </div>
      <div class="list__cell">
        <span>{{ SerialNumber }}</span>
      </div>
      <div class="list__cell">
        <icon :icon="staticIcons.get(`Type-${Type}`)" class="list__icon" />
      </div>
      <div class="list__cell">
        <icon
          :icon="getSignalIcon(Strength)"
          :color="getColorFromPercentage(Strength * 10)"
          class="list__icon"
        />
      </div>
      <div class="list__cell">
        <icon
          :icon="getBatteryIcon(BatteryLevel)"
          :color="getColorFromPercentage(BatteryLevel)"
          class="list__icon"
        />
      </div>
      <div class="list__cell">
        <icon
          :icon="staticIcons.get(`WorkingMode-${WorkingMode}`)"
          class="list__icon"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed, reactive } from "vue";
import { useStore } from "vuex";
import { getColorFromPercentage } from "@/utils/percentage";
import { staticIcons, getBatteryIcon, getSignalIcon } from "@/utils/icons";
import { Radio } from "@/interfaces/radio";

export default defineComponent({
  name: "Table",
  setup() {
    const store = useStore();
    const selectedRadio = computed(() =>
      store.state.radios.find((radio) => radio.Id === store.state.selectedRadio)
    );

    const query = reactive({
      Name: "",
      SerialNumber: "",
      Type: "",
      Strength: true,
      BatteryLevel: true,
      WorkingMode: "",
    });

    // Get radios from store
    const radios = computed(() => {
      return store.state.radios
        .sort((a, b) => {
          if (query.BatteryLevel) return b.BatteryLevel - a.BatteryLevel;
          return a.BatteryLevel - b.BatteryLevel;
        })
        .sort((a, b) => {
          if (query.Strength) return b.Strength - a.Strength;
          return a.Strength - b.Strength;
        })
        .filter((radio: Radio) => {
          return (
            (query.Name === "" || radio.Name.startsWith(query.Name)) &&
            (query.SerialNumber === "" ||
              radio.SerialNumber.startsWith(query.SerialNumber)) &&
            (query.Type === "" || radio.Type === query.Type) &&
            (query.WorkingMode === "" ||
              radio.WorkingMode === query.WorkingMode)
          );
        });
    });

    // Radio select logic
    const selectRadio = (id: number) => {
      store.commit("selectRadio", id);
    };

    return {
      radios,
      getColorFromPercentage,
      staticIcons,
      getBatteryIcon,
      getSignalIcon,
      selectRadio,
      selectedRadio,
      query,
    };
  },
});
</script>

<style lang="scss" scoped>
$icon-size: 25px;
$list-background: #ececec;
$row-background: #ffffff;
$row-background-selected: #ddf3ff;
$row-border-selected: #77deff;
$header-input: #ececec;

.list {
  height: 40vh;
  overflow-y: scroll;
  background: $list-background;

  &__row {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    align-items: center;
    padding: 25px;
    margin: 10px 20px;
    background: $row-background;
    cursor: pointer;
    transition: 0.2s ease-in-out;

    &--header {
      margin: 0;
      padding: 25px 45px;
      position: sticky;
      top: 0;
      box-shadow: 0 0 30px 0px rgba(#000, 0.1);
    }

    &--selected {
      background: $row-background-selected;
      border-left: 8px solid $row-border-selected;
    }
  }

  &__cell {
    display: flex;
    flex-direction: column;

    & > input,
    & > select {
      border: none;
      outline: none;
      padding: 5px;
      margin-top: 5px;
      border-radius: 5px;
      background: $header-input;
      width: 150px;
    }
  }

  &__icon {
    font-size: $icon-size;
  }
}
</style>
