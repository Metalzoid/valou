<script setup>
import {
  add,
  format,
  isSameDay,
  startOfDay,
  isAfter,
  isBefore,
  isFuture,
} from "date-fns";
import { DatePicker } from "v-calendar";
import "v-calendar/dist/style.css";

const allDatas = ref(null);
const allDatasStore = useAllDatasStore();

const props = defineProps(["chipNumberAppointmentHolded"]);

allDatasStore.$subscribe((mutation, state) => {
  allDatas.value = state.allDatas;
});

const chipNumber = computed(() => props.chipNumberAppointmentHolded);

const links = computed(() => [
  {
    to: "hold",
    name: "En attente",
    chipNumber: chipNumber.value,
  },
  {
    to: "accepted",
    name: "Accepté",
  },
  {
    to: "refused",
    name: "Refusé",
  },
  {
    to: "canceled",
    name: "Annulé",
  },
]);

const ranges = [
  { label: "Prochains 7 jours", duration: { days: 7 } },
  { label: "Prochains 14 jours", duration: { days: 14 } },
  { label: "Prochains 30 jours", duration: { days: 30 } },
  { label: "Prochains 3 mois", duration: { months: 3 } },
  { label: "Prochains 6 mois", duration: { months: 6 } },
  { label: "Prochains 12 mois", duration: { months: 12 } },
];

const selected = ref({ start: new Date(), end: add(new Date(), { days: 14 }) });

const isRangeSelected = (duration) => {
  return (
    isSameDay(selected.value.start, new Date()) &&
    isSameDay(selected.value.end, add(new Date(), duration))
  );
};

const selectRange = (duration) => {
  selected.value = { start: new Date(), end: add(new Date(), duration) };
};

const status = ref("accepted");

const pastAppointments = ref([]);
const futureAppointments = ref([]);

const updateStatusRef = (newVal) => {
  status.value = newVal;
};

const defineAppointments = async (statusRef, datas) => {
  futureAppointments.value = [];
  pastAppointments.value = [];

  if (datas) {
    datas.appointments.forEach((app) => {
      if (app.status === statusRef && selected.value) {
        const appStartDate = new Date(app.start_date);
        const appEndDate = new Date(app.end_date);

        if (
          isAfter(appStartDate, startOfDay(selected.value.start)) &&
          isBefore(appEndDate, startOfDay(selected.value.end))
        ) {
          const user = allDatas.value?.customers.find(
            (user) => user.id === app.customer_id
          );

          const appointment = {
            appointment: app,
            user: user,
            from: "dashboard",
          };

          if (isFuture(appStartDate)) {
            futureAppointments.value.push(appointment);
          } else {
            pastAppointments.value.push(appointment);
          }
        }
      }
    });

    futureAppointments.value.sort(
      (a, b) =>
        new Date(a.appointment.start_date) - new Date(b.appointment.start_date)
    );

    pastAppointments.value.sort(
      (a, b) =>
        new Date(a.appointment.start_date) - new Date(b.appointment.start_date)
    );
  }
};

onMounted(() => {
  allDatasStore.loadDatas();
});

watch(
  [() => allDatas.value, () => status.value, () => selected.value],
  ([newAllDatas, newStatus]) => {
    if (newAllDatas) {
      defineAppointments(newStatus, newAllDatas);
    }
  }
);
</script>
<template>
  <div class="container">
    <UPopover :popper="{ placement: 'bottom-start' }" class="mb-5">
      <UButton icon="i-heroicons-calendar-days-20-solid">
        {{ format(selected.start, "d MMM, yyy") }} -
        {{ format(selected.end, "d MMM, yyy") }}
      </UButton>

      <template #panel="{ close }">
        <div
          class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800"
        >
          <div class="hidden sm:flex flex-col py-4">
            <UButton
              v-for="(range, index) in ranges"
              :key="index"
              :label="range.label"
              color="gray"
              variant="ghost"
              class="rounded-none px-6"
              :class="[
                isRangeSelected(range.duration)
                  ? 'bg-gray-100 dark:bg-gray-800'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
              ]"
              truncate
              @click="selectRange(range.duration)"
            />
          </div>
          <DatePicker v-model.range="selected" @close="close" />
        </div>
      </template>
    </UPopover>
    <DashboardMiniLinks
      :status="status"
      :links="links"
      @updateStatusRef="updateStatusRef"
    />
    <UDivider label="Passé" class="mt-5" v-if="pastAppointments.length > 0" />
    <div
      v-for="appointment in pastAppointments"
      v-if="pastAppointments.length > 0"
      :key="appointment.id"
      class="mt-5"
    >
      <DashboardAppointmentCard :appointment="appointment" />
    </div>
    <UDivider
      label="À venir"
      class="mt-5"
      v-if="futureAppointments.length > 0"
    />
    <div
      v-for="appointment in futureAppointments"
      v-if="futureAppointments.length > 0"
      :key="appointment.id"
      class="mt-5"
    >
      <DashboardAppointmentCard :appointment="appointment" />
    </div>
    <h3
      class="mt-5 text-center text-xl w-full"
      v-if="futureAppointments.length + pastAppointments.length === 0"
    >
      Pas de rendez-vous dans la période sélectionnée!
    </h3>
  </div>
</template>
<style lang="scss" scoped>
.container {
  display: flex;
  width: 35vw;
  flex-direction: column;
  margin-top: 0rem;
}
</style>
