<script setup>
const allDatasStore = useAllDatasStore();
const services = ref(null);
const servicesForCharts = ref({});

allDatasStore.$subscribe((mutation, state) => {
  services.value = state.allDatas.services.sort(
    (a, b) => a.disabled - b.disabled
  );
  servicesForCharts.value = {};
  state.allDatas.appointments.forEach((appointment) => {
    if (appointment.status === "finished") {
      appointment.services.forEach((service) => {
        if (!servicesForCharts.value[service.title]) {
          servicesForCharts.value[service.title] = 0;
        }
        servicesForCharts.value[service.title] += 1;
      });
    }
  });
});

const createServiceModal = ref(false);
const closeCreateService = () => {
  createServiceModal.value = false;
};
</script>

<template>
  <Modal
    :isOpen="createServiceModal"
    :title="`Ajouter une prestation`"
    @update:isOpen="(value) => (createServiceModal = value)"
  >
    <DashboardServiceForm
      @closeModal="closeCreateService"
      @addNewService="addNewService"
      method="create"
    />
  </Modal>
  <div class="container">
    <div>
      <h3 class="text-3xl mt-8 text-nowrap text-indigo-700">Vos prestations</h3>
      <UDivider />
    </div>
    <UButton class="my-5 w-fit" @click="createServiceModal = true">
      Ajouter une prestation
    </UButton>
    <div v-for="service in services" :key="service.id">
      <DashboardServiceCard :service="service" />
    </div>
  </div>
  <UDivider orientation="vertical" />
  <div class="flex flex-col gap-5 w-5/12">
    <div>
      <h3 class="text-3xl mt-8 text-nowrap text-indigo-700">
        Vos statistiques
      </h3>
      <UDivider />
    </div>
    <div class="flex w-100 justify-around mt-3">
      <!-- <DashboardMiniCard title="Aujourd'hui" />
      <DashboardMiniCard title="7 prochains jours" /> -->
      <BarChart :services="servicesForCharts" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  margin: 0 4rem;
}
</style>
