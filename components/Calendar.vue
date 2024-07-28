<template>
  <div id="modalCalendar"></div>
  <!-- <div class="container mx-auto mt-5">
    <FullCalendar :options="calendarOptions" />
  </div> -->
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
      </template>

      <Placeholder class="h-32" />
    </UCard>
  </UModal>
</template>

<script>
import { ref } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import frLocale from "@fullcalendar/core/locales/fr";
export default {
  components: {
    FullCalendar,
  },
  setup() {
    const isOpen = ref(false);

    const getAvailabilities = async () => {
      const { $api } = useNuxtApp();
      const response = await $api.get.availabilities();
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
      events: async (info, successCallback, failureCallback) => {
        try {
          const events = await getAvailabilities();
          successCallback(events);
        } catch (error) {
          failureCallback(error);
        }
      },
      eventClick: function (info) {
        isOpen.value = true;
      },
    });

    return {
      isOpen,
      calendarOptions,
    };
  },
};
</script>
