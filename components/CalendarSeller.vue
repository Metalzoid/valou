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
    const allDatasStore = useAllDatasStore();
    const allDatas = ref({});
    const user = ref(null);
    const createAvailabilityModal = ref(false);
    const infosEventsModal = ref(false);
    const calendarRef = ref(null);
    const eventsInfos = ref(null);
    const selectedDates = ref(null);
    const modalTitleEvents = ref("");
    const availabilities = ref([]);
    const unavailabilities = ref([]);
    const appointments = ref([]);
    const filteredUnavailabilities = ref([]);

    const handleModalTitle = (title) => {
      modalTitleEvents.value = title;
    };

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

    const minDuration = (date1, date2) => {
      const start = new Date(date1);
      const end = new Date(date2);
      return (end - start) / 60000 > 5;
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
        const eventsSources = calendarRef.value.getApi().getEventSources();
        if (eventsSources.length > 0) {
          eventsSources.forEach((event) => {
            event.remove();
          });
        }
      }
    };

    const isDateRangeEqual = (date1, date2) => {
      return (
        date1.start.toISOString() == date2.start.toISOString() &&
        date1.end.toISOString() == date2.end.toISOString()
      );
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
          dayCount: 5,
          buttonText: "5 jours",
        },
        timeOneDayGrid: {
          type: "timeGrid",
          dayCount: 1,
          buttonText: "Jour",
          titleFormat: { year: "numeric", month: "2-digit", day: "2-digit" },
        },
      },
      height: "auto",
      nowIndicator: true,
      locale: frLocale,
      headerToolbar: {
        left: "prev,today,next",
        right: "timeGridWeek,fiveDaysTimeGrid,timeOneDayGrid",
      },
      allDaySlot: false,
      slotMinTime: "07:00:00",
      slotMaxTime: "20:00:00",
      expandRows: true,
      selectable: true,
      selectMirror: true,
      selectOverlap: false,
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

    allDatasStore.$subscribe((mutation, state) => {
      allDatas.value = state.allDatas;
    });

    watch(
      () => allDatas.value,
      (newVal) => {
        refetchEvents();
        appointments.value = [];
        availabilities.value = [];
        unavailabilities.value = [];

        newVal.appointments.length > 0
          ? newVal.appointments
              .filter((data) =>
                [("accepted", "finished")].includes(data.status)
              )
              .forEach((data) => {
                const appointment = {
                  type: "appointment",
                  id: data.id,
                  title: "Rendez-vous",
                  start: new Date(data.start_date),
                  end: new Date(data.end_date),
                  price: data.price,
                  comment: data.comment,
                  seller_comment: data.seller_comment,
                  status: data.status,
                  customer_id: data.customer_id,
                  services: data.services,
                  borderColor: "0000FF",
                  color: "#4DBFF7",
                };
                appointments.value.push(appointment);
              })
          : [];

        newVal.availabilities.length > 0
          ? newVal.availabilities.forEach((date) => {
              if (
                minDuration(date.start_date, date.end_date) &&
                date.available
              ) {
                const availability = {
                  type: "availability",
                  title: "Disponible",
                  start: new Date(date.start_date),
                  end: new Date(date.end_date),
                  available: date.available,
                  id: date.id,
                  color: "#EEFFEE",
                  borderColor: "#66CC00",
                  textColor: "black",
                };
                availabilities.value.push(availability);
              } else if (
                minDuration(date.start_date, date.end_date) &&
                !date.available
              ) {
                unavailabilities.value.push({
                  type: "unavailability",
                  title: "INDISPO",
                  start: new Date(date.start_date),
                  end: new Date(date.end_date),
                  available: date.available,
                  id: date.id,
                  color: "#FC5C5C",
                  borderColor: "#FF0000",
                  textColor: "black",
                });
              }
            })
          : [];
        if (unavailabilities.value.length > 0) {
          filteredUnavailabilities.value = unavailabilities.value.filter(
            (obj1) => {
              return !appointments.value.some((obj2) =>
                isDateRangeEqual(obj1, obj2)
              );
            }
          );
        }
        calendarRef.value.getApi().addEventSource(appointments.value);
        calendarRef.value.getApi().addEventSource(availabilities.value);
        calendarRef.value
          .getApi()
          .addEventSource(filteredUnavailabilities.value);
      }
    );

    return {
      calendarRef,
      calendarOptions,
      closeCreateAvailability,
      createAvailabilityModal,
      infosEventsModal,
      eventsInfos,
      closeInfosEvents,
      selectedDates,
      handleModalTitle,
      modalTitleEvents,
    };
  },
};
</script>

<template>
  <div class="mt-5 mx-auto items-center flex flex-col place-content-center">
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
        :selectedDates="selectedDates"
      />
    </Modal>
    <Modal
      :isOpen="infosEventsModal"
      :title="modalTitleEvents"
      @update:isOpen="(value) => (infosEventsModal = value)"
    >
      <InfosEvents
        :eventsInfos="eventsInfos"
        @closeEvents="closeInfosEvents"
        @modalTitle="handleModalTitle"
    /></Modal>
    <FullCalendar
      :options="calendarOptions"
      ref="calendarRef"
      style="width: 75vw"
    />
  </div>
</template>

<style scoped></style>
