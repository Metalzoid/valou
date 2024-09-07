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
    const { getData } = useApi();
    const user = ref(null);
    const date = ref();
    const createAvailabilityModal = ref(false);
    const infosAvailabilityModal = ref(false);
    const calendarRef = ref(null);
    const availabilityInfos = ref(null);
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
      try {
        const response = await getData(`availabilities`);
        if (response.success) {
          const dates = response.data.data.availabilities;
          return dates.length > 0
            ? dates.map((date) => ({
                title: "Disponible",
                start: new Date(date.start_date),
                end: new Date(date.end_date),
                id: date.id,
              }))
            : [];
        } else {
          return [];
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          return [];
        } else {
          throw error;
        }
      }
    };

    const closeCreateAvailability = () => {
      createAvailabilityModal.value = false;
    };

    const closeInfosAvailability = () => {
      infosAvailabilityModal.value = false;
    };

    const openInfosModal = (info) => {
      infosAvailabilityModal.value = true;
      return {
        id: info.event.id,
        start: info.event.start.toLocaleString("fr-FR"),
        end: info.event.end.toLocaleString("fr-FR"),
      };
    };

    const refetchEvents = () => {
      if (calendarRef.value) {
        calendarRef.value.getApi().refetchEvents();
      }
    };

    const calendarOptions = ref({
      plugins: [interactionPlugin, timeGridPlugin],
      initialView: "timeGridWeek",
      height: 700,
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
      selectable: true,
      events: async (info, successCallback, failureCallback) => {
        try {
          const events = await getAvailabilities();
          successCallback(events);
        } catch (error) {
          failureCallback(error);
        }
      },
      eventClick: function (info) {
        availabilityInfos.value = openInfosModal(info);
      },
    });

    return {
      calendarRef,
      calendarOptions,
      date,
      refetchEvents,
      closeCreateAvailability,
      createAvailabilityModal,
      infosAvailabilityModal,
      availabilityInfos,
      closeInfosAvailability,
    };
  },
};
</script>

<template>
  <div>
    <div class="container mx-auto w-100 mt-5 items-center flex flex-col">
      <h1 class="text-center text-5xl mb-6">Mon calendrier</h1>
      <UButton class="w-1/12" @click="createAvailabilityModal = true">
        Créer une Disponibilité
      </UButton>
      <Modal
        :isOpen="createAvailabilityModal"
        :title="`Créer une disponibilité`"
        @update:isOpen="(value) => (createAvailabilityModal = value)"
      >
        <CreateAvailabilityForm
          @closeModal="closeCreateAvailability()"
          @refetchEvents="refetchEvents()"
        />
      </Modal>
      <Modal
        :isOpen="infosAvailabilityModal"
        :title="`Infos disponibilité`"
        @update:isOpen="(value) => (infosAvailabilityModal = value)"
        @refetchEvents="refetchEvents()"
      >
        <InfosAvailability
          :availabilityInfos="availabilityInfos"
          @closeAvailability="closeInfosAvailability()"
          @refetchEvents="refetchEvents()"
      /></Modal>
      <FullCalendar
        :options="calendarOptions"
        ref="calendarRef"
        style="width: 60vw"
      />
    </div>
  </div>
</template>

<style scoped></style>
