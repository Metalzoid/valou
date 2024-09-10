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
    const { getData, getUserByID, updateData } = useApi();
    const user = ref(null);
    const createAvailabilityModal = ref(false);
    const infosEventsModal = ref(false);
    const calendarRef = ref(null);
    const eventsInfos = ref(null);
    const selectedDates = ref(null);

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

    const getUserInfos = async (id) => {
      try {
        const response = await getUserByID(id);
        if (response.success) {
          const user = response.data.data;
          return {
            user_id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            company: user.company,
            role: user.role,
          };
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getAvailabilities = async () => {
      try {
        const response = await getData(`availabilities`);
        if (response.success) {
          const dates = response.data.data.availabilities;
          return dates.length > 0
            ? dates.map((date) => ({
                type: "availability",
                title: "Disponible",
                start: new Date(date.start_date),
                end: new Date(date.end_date),
                available: date.available,
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

    const getAppointments = async () => {
      try {
        const response = await getData(`appointments`);

        if (response.success) {
          const datas = response.data.data;
          if (datas.length > 0) {
            return Promise.all(
              datas
                .filter((data) => data.appointment.status === "accepted")
                .map(async (data) => ({
                  type: "appointment",
                  id: data.appointment.id,
                  title: "Rendez-vous",
                  start: new Date(data.appointment.start_date),
                  end: new Date(data.appointment.end_date),
                  price: data.appointment.price,
                  comment: data.appointment.comment,
                  seller_comment: data.appointment.seller_comment,
                  status: data.appointment.status,
                  customer: await getUserInfos(data.appointment.customer_id),
                  services: data.services,
                }))
            );
          } else {
            return [];
          }
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

    const closeInfosEvents = () => {
      infosEventsModal.value = false;
    };

    const openInfosModal = () => {
      infosEventsModal.value = true;
    };

    const refetchEvents = () => {
      if (calendarRef.value) {
        calendarRef.value.getApi().refetchEvents();
      }
    };

    const setupTimeGridDay = () => {
      if (window.innerWidth > 1150) {
        return "timeGridWeek";
      } else if (window.innerWidth > 850) {
        return "fiveDaysTimeGrid";
      } else {
        return "timeGridDay";
      }
    };

    const calendarOptions = ref({
      plugins: [interactionPlugin, timeGridPlugin],
      initialView: setupTimeGridDay(),
      views: {
        fiveDaysTimeGrid: {
          type: "timeGrid",
          duration: { days: 5 },
          buttonText: "5 jours",
        },
      },
      height: "auto",
      nowIndicator: true,
      locale: frLocale,
      headerToolbar: {
        left: "prev,today,next",
        right: "timeGridWeek,fiveDaysTimeGrid,timeGridDay",
      },
      allDaySlot: false,
      slotMinTime: "07:00:00",
      slotMaxTime: "20:00:00",
      expandRows: true,
      selectable: true,
      selectMirror: true,
      selectOverlap: false,
      events: async (info, successCallback, failureCallback) => {
        try {
          const availabilities = await getAvailabilities();
          const appointments = await getAppointments();
          const data = [...availabilities, ...appointments];
          successCallback(data);
        } catch (error) {
          failureCallback(error);
        }
      },
      eventClick: function (info) {
        openInfosModal();
        eventsInfos.value = info;
      },
      select: function (info) {
        selectedDates.value = {
          start: info.startStr,
          end: info.endStr,
        };
        createAvailabilityModal.value = true;
      },
      windowResize: () => {
        updateWidth();
      },
    });

    const updateWidth = () => {
      const calendarHeader = document.querySelector(".fc-header-toolbar");
      const calendarApi = calendarRef.value.getApi();
      if (window.innerWidth < 651) {
        calendarHeader.style.flexWrap = "wrap";
        calendarHeader.style.justifyContent = "center";
        calendarHeader.style.gap = "5px";
        calendarApi.changeView("timeGridDay");
      } else if (window.innerWidth < 850) {
        calendarApi.changeView("fiveDaysTimeGrid");
      } else if (window.innerWidth > 1150) {
        calendarApi.changeView("timeGridWeek");
      } else {
        calendarHeader.style.flexWrap = "nowrap";
        calendarHeader.style.justifyContent = "space-between";
        calendarApi.changeView("timeGridWeek");
      }
    };

    onMounted(() => {
      updateWidth();
    });

    return {
      calendarRef,
      calendarOptions,
      refetchEvents,
      closeCreateAvailability,
      createAvailabilityModal,
      infosEventsModal,
      eventsInfos,
      closeInfosEvents,
      selectedDates,
    };
  },
};
</script>

<template>
  <div
    class="container mx-auto items-center flex flex-col place-content-center min-h-screen"
  >
    <h1 class="text-center text-4xl mb-6">Mon calendrier</h1>
    <UButton
      class="mb-5"
      @click="(createAvailabilityModal = true) && (selectedDates = null)"
    >
      Créer une Disponibilité
    </UButton>
    <Modal
      :isOpen="createAvailabilityModal"
      :title="`Créer une disponibilité`"
      @update:isOpen="(value) => (createAvailabilityModal = value)"
    >
      <CreateAvailabilityForm
        @closeModal="closeCreateAvailability"
        @refetchEvents="refetchEvents"
        :selectedDates="selectedDates"
      />
    </Modal>
    <Modal
      :isOpen="infosEventsModal"
      :title="
        eventsInfos?.event?.extendedProps?.status
          ? `Votre rendez-vous avec ${eventsInfos.event.extendedProps.customer.firstname} ${eventsInfos.event.extendedProps.customer.lastname}`
          : 'Votre disponibilité'
      "
      @update:isOpen="(value) => (infosEventsModal = value)"
      @refetchEvents="refetchEvents"
    >
      <InfosEvents
        :eventsInfos="eventsInfos"
        @closeEvents="closeInfosEvents"
        @refetchEvents="refetchEvents"
    /></Modal>
    <FullCalendar
      :options="calendarOptions"
      ref="calendarRef"
      style="width: 75vw"
    />
  </div>
</template>

<style scoped></style>
