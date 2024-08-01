<script>
import { ref, onMounted, watch, computed } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import frLocale from "@fullcalendar/core/locales/fr";
import DatePicker from "./DatePicker";

export default {
  components: {
    FullCalendar,
    DatePicker,
  },
  setup() {
    const { get } = useFetchData();
    const isOpen = ref(false);
    const date = ref(new Date());
    const user = ref(null);
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          user.value = parsedUser.value.user;
        } catch (err) {
          console.error(err);
        }
      }
    }

    const getAvailabilities = async () => {
      const response = await get(`availabilities?user=${user.value.id}`);
      const dates = response.data.dates;
      return dates.map((date) => ({
        title: "Disponible",
        start: new Date(date.from),
        end: new Date(date.to),
      }));
    };

    const calendarOptions = ref({
      plugins: [interactionPlugin, timeGridPlugin],
      initialView: "timeGridWeek",
      nowIndicator: true,
      editable: true,
      locale: frLocale,
      headerToolbar: {
        left: "prev,next",
        center: "title",
        right: "timeGridWeek,timeGridDay",
      },
      titleFormat: { year: "numeric", month: "long", day: "numeric" },
      allDaySlot: false,
      slotMinTime: "07:00:00",
      slotMaxTime: "19:00:00",
      expandRows: true,
      eventClick: function (info) {
        isOpen.value = true;
      },
      events: async (info, successCallback, failureCallback) => {
        try {
          const events = await getAvailabilities();
          successCallback(events);
        } catch (error) {
          failureCallback(error);
        }
      },
    });

    return {
      isOpen,
      calendarOptions,
      date,
    };
  },
};
</script>

<template>
  <div>
    <div class="container mx-auto mt-5">
      <h1 class="text-center text-5xl mb-16">Mes Disponibilitées</h1>
      <FullCalendar :options="calendarOptions" ref="calendarRef" />
    </div>
    <UModal v-model="isOpen" prevent-close>
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Prendre un rendez-vous
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isOpen = false"
            />
          </div>
          <DatePicker v-model="date" is-required @close="close" />
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<style scoped>
/* Ajoutez des styles CSS pour votre composant ici */
</style>
