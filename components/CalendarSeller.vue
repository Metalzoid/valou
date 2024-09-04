<script>
import { ref, onMounted, watch, computed } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import frLocale from "@fullcalendar/core/locales/fr";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

export default {
  components: {
    FullCalendar,
    VueDatePicker,
  },
  setup() {
    const { get } = useApi();
    const isOpen = ref(false);
    const user = ref(null);
    const date = ref();
    const calendarRef = ref(null);
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
      const response = await get(`availabilities`);
      const dates = response.data.data.dates;
      return dates.map((date) => ({
        title: "Disponible",
        start: new Date(date.from),
        end: new Date(date.to),
      }));
    };

    const calendarOptions = ref({
      plugins: [interactionPlugin, timeGridPlugin],
      initialView: "timeGridWeek",
      height: 650,
      nowIndicator: true,
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
    });

    const closeModal = () => {
      isOpen.value = false;
    };

    const refetchEvents = () => {
      if (calendarRef.value) {
        calendarRef.value.getApi().refetchEvents();
      }
    };

    return {
      calendarRef,
      isOpen,
      calendarOptions,
      date,
      closeModal,
      refetchEvents,
    };
  },
};
</script>

<template>
  <div>
    <div class="container mx-auto w-100 mt-5 items-center flex flex-col">
      <h1 class="text-center text-5xl mb-6">Mes Disponibilitées</h1>
      <UButton class="w-1/12" @click="isOpen = true"
        >Créer une disponibilitée</UButton
      >
      <FullCalendar
        :options="calendarOptions"
        ref="calendarRef"
        style="width: 60vw"
      />
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
              Créer une disponibilitée
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="closeModal()"
            />
          </div>

          <CreateAvailabilityForm
            @closeModal="closeModal()"
            @refetchEvents="refetchEvents"
          />
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<style scoped></style>
