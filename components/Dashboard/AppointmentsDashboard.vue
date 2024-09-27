<script setup>
import {
  add,
  format,
  isSameDay,
  startOfDay,
  isAfter,
  isBefore,
} from "date-fns";
import { DatePicker } from "v-calendar";
import "v-calendar/dist/style.css";

const allDatas = ref(null);
const allDatasStore = useAllDatasStore();

allDatasStore.$subscribe((mutation, state) => {
  allDatas.value = state.allDatas;
});

const chipNumberHold = ref(0);

const links = ref([
  {
    to: "hold",
    name: "En attente",
    chipNumber: chipNumberHold.value,
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

const appointments = ref([]);

const updateStatusRef = (newVal) => {
  status.value = newVal;
};

const defineAppointments = async (statusRef) => {
  appointments.value = [];
  chipNumberHold.value = 0;
  allDatas.value.appointments.map((app) => {
    if (app.status == "hold") {
      chipNumberHold.value += 1;
    }
    if (app.status === statusRef && selected.value) {
      if (
        isAfter(new Date(app.start_date), startOfDay(selected.value.start)) &&
        isBefore(new Date(app.end_date), startOfDay(selected.value.end))
      ) {
        const user = allDatas.value?.customers.find(
          (user) => user.id === app.customer_id
        );
        const appointment = {
          appointment: app,
          user: user,
          from: "dashboard",
        };
        appointments.value.push(appointment);
      } else {
        return [];
      }
    } else {
      return [];
    }
  });
};

onMounted(async () => {
  await allDatasStore.loadDatas();
  allDatas.value = allDatasStore.allDatas;
  defineAppointments(status.value);
});

watch(
  () => allDatas.value,
  () => {
    defineAppointments(status.value);
  }
);

watch(
  () => status.value,
  (newVal) => {
    defineAppointments(newVal);
  }
);

watch(
  () => selected.value,
  () => {
    defineAppointments(status.value);
  }
);

watch(
  () => chipNumberHold.value,
  (newValue) => {
    links.value = links.value.map((link) => {
      if (link.to === "hold") {
        return { ...link, chipNumber: newValue };
      }
      return link;
    });
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

    <div
      v-for="appointment in appointments"
      v-if="appointments.length > 0"
      :key="appointment.id"
      class="mt-5"
    >
      <DashboardAppointmentCard
        :appointment="appointment"
        :services="allDatas?.services"
      />
    </div>
    <h3 class="mt-5 text-center text-xl w-full" v-if="appointments.length == 0">
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
