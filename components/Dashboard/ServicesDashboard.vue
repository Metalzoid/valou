<script setup>
const props = defineProps({
  allDatas: Object,
});

const services = ref(props.allDatas?.services);

const checkId = (service, inputService) => {
  return service.id === inputService.id;
};

const updateService = (inputService) => {
  const indexService = services.value.findIndex((service) =>
    checkId(service, inputService)
  );
  services.value[indexService] = inputService;
};

const createServiceModal = ref(false);
const closeCreateService = () => {
  createServiceModal.value = false;
};

const addNewService = (service) => {
  services.value.push(service);
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
      <DashboardServiceCard :service="service" @updateService="updateService" />
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
      <DashboardMiniCard title="Aujourd'hui" />
      <DashboardMiniCard title="7 prochains jours" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  margin: 0 4rem;
}
</style>
