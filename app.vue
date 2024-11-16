<script setup>
import { compareAsc } from "date-fns";
const { webSocket } = useApi();
const allDatasStore = useAllDatasStore();
const userStore = useUserStore();

const allDatas = ref(null);
const chipNumberAppointmentHolded = ref(0);

allDatasStore.$subscribe((mutation, state) => {
  allDatas.value = state.allDatas;
  defineChipNumber();
});

const defineChipNumber = () => {
  chipNumberAppointmentHolded.value = 0;
  if (!allDatas.value) return;
  allDatas.value.appointments?.forEach((appointment) => {
    // If appointment status is hold && Appointment.start_date > Now, set chipNumber +1
    if (
      appointment.status === "hold" &&
      compareAsc(new Date(appointment.start_date), new Date()) === 1
    ) {
      chipNumberAppointmentHolded.value += 1;
    }
  });
};

watch(
  () => userStore.currentUser,
  () => {
    try {
      webSocket();
    } catch (error) {
      console.error("Failed to update data:", error);
    }
  }
);
</script>

<template>
  <div class="text-black">
    <Navbar :chipNumberAppointmentHolded="chipNumberAppointmentHolded" />
    <NuxtPage :chipNumberAppointmentHolded="chipNumberAppointmentHolded" />
    <UModals />
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;700&display=swap");
</style>

<style lang="scss">
body {
  margin: 0 auto 0 15vw;
  background-color: rgb(244 244 245);
  transition: all ease-in-out 0.4s;
  @media (max-width: 855px) {
    margin-left: 0;
    margin-top: 4rem;
  }
}
.container {
  margin: 4rem;
  width: auto;
  display: flex;
  flex-direction: column;
}
#toTopButton {
  z-index: 5;
  padding: 8px 10px;
  border-radius: 150px;
  border: transparent;
  background: #f0efef;
  box-shadow: 5px 5px 16px #b4b3b3, -5px -5px 16px #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 70px;
  bottom: 70px;
  position: fixed;
  cursor: pointer;

  &:hover {
    border-radius: 150px;
    background: #ebebeb;
    box-shadow: 5px 5px 15px #a3a2a2, -5px -5px 15px #ffffff;
  }

  @media (max-width: 855px) {
    display: none;
    background-color: rgb(244 244 245);
  }
}
</style>
