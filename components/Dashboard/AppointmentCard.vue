<script setup>
const props = defineProps({
  appointment: Object,
});

const appointment = ref({
  minTime: null,
  maxTime: null,
  minutes: null,
  user: null,
});

onMounted(() => {
  const minTime = new Date(props.appointment.start_date);
  appointment.value.minTime = minTime;
  const maxTime = new Date(props.appointment.end_date);
  appointment.value.maxTime = maxTime;
  appointment.value.minutes = (maxTime - minTime) / 60000;
  appointment.value.user = props.appointment.user;
});

watch(
  () => props.appointment,
  (newVal) => {
    const minTime = new Date(newVal.start_date);
    appointment.value.minTime = minTime;
    const maxTime = new Date(newVal.end_date);
    appointment.value.maxTime = maxTime;
    appointment.value.minutes = (maxTime - minTime) / 60000;
    appointment.value.user = props.appointment.user;
  }
);
</script>

<template>
  <div class="cards">
    <div class="flex justify-between w-full items-start">
      <h1 class="font-mono text-3xl text-indigo-700">
        {{ appointment.user?.firstname }} {{ appointment?.user?.lastname }}
      </h1>
      <NuxtImg src="/img/profil-manquant.jpg" class="h-12 w-12" />
    </div>
    <UDivider />
    <div class="flex justify-between w-full">
      <h5>
        {{ appointment?.minTime?.toLocaleTimeString().substring(0, 5) }}
        <font-awesome-icon
          :icon="['fas', 'caret-right']"
          style="color: #b3b3b3"
        />
        {{ appointment?.maxTime?.toLocaleTimeString().substring(0, 5) }}
      </h5>
      <p>
        <font-awesome-icon :icon="['fas', 'clock']" style="color: #c9c9c9" />
        {{ appointment?.minutes }} minutes
      </p>
      <p>{{ appointment?.user?.phone_number }}</p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.cards {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30vw;
  background-color: white;
  margin-top: 2rem;
  padding: 1rem;
  border-radius: 1rem;
  gap: 1rem;
  box-shadow: 4px 4px 10px rgba(1, 1, 1, 0.2);
}
</style>
