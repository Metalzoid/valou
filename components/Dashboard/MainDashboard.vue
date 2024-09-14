<script setup>
const props = defineProps(["allDatas"]);
const links = [
  {
    to: "yesterday",
    name: "Hier",
  },
  {
    to: "today",
    name: "Aujourd'hui",
  },
  {
    to: "tomorrow",
    name: "Demain",
  },
];

const appointments = ref([]);
const date = ref("today");
const today = ref(0);
const thisWeek = ref(0);

const defineAppointments = (minDate, maxDate) => {
  appointments.value = [];
  props.allDatas.appointments.map((app) => {
    if (minDate && maxDate && app.status === "accepted") {
      if (
        new Date(app.start_date) > minDate &&
        new Date(app.end_date) < maxDate
      ) {
        const user = props.allDatas.customers.find(
          (user) => user.id === app.customer_id
        );
        const appointment = {
          start_date: app.start_date,
          end_date: app.end_date,
          user: user,
        };
        appointments.value.push(appointment);
      }
    }
  });
};

const defineAppointmentsNumber = (minDate, maxDate, destination) => {
  destination.value = 0;

  props.allDatas.appointments.map((app) => {
    if (minDate && maxDate && app.status === "accepted") {
      if (
        new Date(app.start_date) > minDate &&
        new Date(app.end_date) < maxDate
      ) {
        destination.value += 1;
      }
    }
  });
};

onMounted(() => {
  const minDate = new Date();
  minDate.setHours("00", "00", "01");
  const maxDate = new Date();
  maxDate.setHours("23", "59", "59");
  defineAppointments(minDate, maxDate);
  defineAppointmentsNumber(minDate, maxDate, today);
  minDate.setDate(minDate.getDate() + 1);
  maxDate.setDate(maxDate.getDate() + 7);
  defineAppointmentsNumber(minDate, maxDate, thisWeek);
});

watch(
  () => date.value,
  (newVal) => {
    if (newVal === "today") {
      const minDate = new Date();
      minDate.setHours("00", "00", "01");
      const maxDate = new Date();
      maxDate.setHours("23", "59", "59");
      defineAppointments(minDate, maxDate);
    } else if (newVal === "yesterday") {
      const minDate = new Date();
      const maxDate = new Date();
      minDate.setDate(minDate.getDate() - 1);
      minDate.setHours("00", "00", "01");
      maxDate.setDate(maxDate.getDate() - 1);
      maxDate.setHours("23", "59", "59");
      defineAppointments(minDate, maxDate);
    } else {
      const minDate = new Date();
      const maxDate = new Date();
      minDate.setDate(minDate.getDate() + 1);
      minDate.setHours("00", "00", "01");
      maxDate.setDate(maxDate.getDate() + 1);
      maxDate.setHours("23", "59", "59");
      defineAppointments(minDate, maxDate);
    }
  }
);
</script>
<template>
  <div class="container">
    <ul class="links" ref="linksDiv">
      <p
        v-for="link in links"
        :class="{ active: date === link.to }"
        :key="link.id"
        class="cursor-pointer"
        @click="date = link.to"
      >
        {{ link.name }}
      </p>
    </ul>
    <div
      v-for="appointment in appointments"
      v-if="appointments.length > 0"
      :key="appointment.id"
    >
      <DashboardAppointmentCard :appointment="appointment" />
    </div>
    <h3
      style="width: 30vw"
      class="mt-5 text-center text-xl"
      v-if="appointments.length == 0"
    >
      Pas de rendez-vous !
    </h3>
  </div>
  <UDivider orientation="vertical" />
  <div class="flex flex-col gap-5 w-5/12">
    <div>
      <h3 class="text-3xl mt-8 text-nowrap text-indigo-700">Vos rendez-vous</h3>
      <UDivider />
    </div>
    <div class="flex w-100 justify-around mt-3">
      <DashboardMiniCard title="Aujourd'hui" :content="today" />
      <DashboardMiniCard title="7 prochains jours" :content="thisWeek" />
    </div>
  </div>
</template>
<style scoped lang="scss">
.container {
  display: flex;
  width: max-content;
  flex-direction: column;
  margin-top: 2rem;
  .links {
    background-color: white;
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    border-radius: 0.7rem;
    padding: 0.7rem;
    box-shadow: 4px 4px 10px rgba(1, 1, 1, 0.2);
    transition: all ease-in-out 0.3s;
    a {
      transition: all ease-in-out 0.2s;
      padding: 0.3rem;
      border: 1px solid transparent;
      border-radius: 0.7rem;
      &:hover {
        color: #ed682e;
        box-shadow: 2px 2px 10px rgba(1, 1, 1, 0.08);
      }
    }

    .active {
      color: rgba(237, 104, 46, 1);
    }
  }
}
</style>
