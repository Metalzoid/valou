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
    const vendors = ref([]);
    const vendor = ref(null);
    const calendarRef = ref(null);

    const getVendors = async () => {
      const response = await get("vendors");
      if (response) {
        vendors.value = response.data.vendors.map((vendor) => ({
          id: vendor.id,
          firstname: vendor.firstname,
        }));
        if (vendors.value.length > 0) {
          vendor.value = vendors.value[0].id; // Set the initial selected vendor ID
        }
      }
    };

    const getAvailabilities = async () => {
      if (!vendor.value) return [];
      const response = await get(`availabilities?user=${vendor.value}`);
      const dates = response.data.dates;
      return dates.map((date) => ({
        title: "Disponible",
        start: new Date(date.from),
        end: new Date(date.to),
      }));
    };

    const refreshCalendar = async () => {
      const events = await getAvailabilities();
      if (calendarRef.value) {
        const calendarApi = calendarRef.value.getApi();
        calendarApi.removeAllEvents();
        calendarApi.addEventSource(events);
      }
    };

    onMounted(async () => {
      await getVendors();
      refreshCalendar();
    });

    watch(vendor, () => {
      refreshCalendar();
    });

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
      vendors,
      vendor,
      date,
      calendarRef,
      vendorOptions: computed(() =>
        vendors.value.map((v) => ({ label: v.firstname, value: v.id }))
      ), // vendor options for select
    };
  },
};
</script>

<template>
  <div>
    <div class="container mx-auto mt-5">
      <UFormGroup label="Vendors" description="Select a vendor.">
        <USelect v-model="vendor" :options="vendorOptions" />
      </UFormGroup>
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
