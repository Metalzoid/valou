<script setup>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const props = defineProps({
  services: Object,
});

const chartData = ref({});
const loaded = ref(false);

const chartOptions = {
  loaded: false,
  responsive: true,
};

watch(
  () => props.services,
  (newVal) => {
    let tempDataset = [];

    tempDataset.push({
      label: "Prestations effectuées",
      backgroundColor: "#f87979",
      data: Object.values(newVal),
    });

    chartData.value = {
      labels: Object.keys(newVal),
      datasets: tempDataset,
    };

    loaded.value = true;
  }
);
</script>

<template>
  <Bar
    id="my-chart-id"
    :options="chartOptions"
    :data="chartData"
    v-if="loaded"
  />
</template>
