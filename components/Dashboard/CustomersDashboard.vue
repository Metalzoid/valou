<script setup>
const allDatas = ref(null);
const allDatasStore = useAllDatasStore();
allDatasStore.$subscribe((mutation, state) => {
  allDatas.value = state.allDatas;
});
</script>
<template>
  <div class="container">
    <div>
      <h3 class="text-3xl mt-8 text-nowrap text-indigo-700">Vos clients</h3>
      <UDivider />
    </div>
    {{ allDatas.customers }}
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
