<script setup>
const route = useRoute();

const props = defineProps({
  links: [
    {
      to: String,
      fullpath: String,
      name: String,
    },
  ],
});

const toggleDashboardNavbar = ref(true);
const linksDiv = ref(null);
const arrowToggle = ref(null);
const displayToggle = ref(false);

const updateWidth = () => {
  window.innerWidth < "856"
    ? (displayToggle.value = true)
    : (displayToggle.value = false);
};

const toggle = () => {
  if (toggleDashboardNavbar.value === true) {
    toggleDashboardNavbar.value = false;
    linksDiv.value.style.transform = "translateY(0vh)";
    arrowToggle.value.style.transform = "translateY(0vh)";
    arrowToggle.value.style.transform = "rotate(180deg)";
  } else {
    toggleDashboardNavbar.value = true;
    linksDiv.value.style.transform = "translateY(-18vh)";
    arrowToggle.value.style.transform = "rotate(0deg)";
    arrowToggle.value.style.transform = "translateY(-9vh)";
  }
};

onMounted(() => {
  updateWidth();
  window.addEventListener("resize", updateWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
});
</script>

<template>
  <div class="container">
    <ul class="links" ref="linksDiv">
      <NuxtLink
        v-for="link in props.links"
        :to="link.to"
        :class="{ active: route.fullPath === link.fullpath }"
        >{{ link.name }}</NuxtLink
      >
    </ul>
    <div v-if="displayToggle" class="toggleDashboardNavbar" ref="arrowToggle">
      <font-awesome-icon
        icon="arrow-down"
        ref="arrowToggle"
        @click="toggle()"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  margin: 4rem;
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  .links {
    display: flex;
    justify-content: space-evenly;
    background-color: white;
    width: 75vw;
    border-radius: 0.4rem;
    padding: 0.5rem;
    box-shadow: 4px 4px 10px rgba(1, 1, 1, 0.2);
    transition-timing-function: cubic-bezier(10, 2, 3, 1);
    transition: all ease-in-out 0.3s;
    transform: translateY(-0vw);
    a {
      transition: all ease-in-out 0.25s;
      padding: 0.5rem;
      border: 1px solid transparent;
      border-radius: 0.45rem;
      &:hover {
        color: #ed682e;
        box-shadow: 2px 2px 25px rgba(1, 1, 1, 0.12);
      }
    }

    .active {
      color: rgba(237, 104, 46, 1);
    }
    @media only screen and (max-width: 855px) {
      transform: translateY(-18vh);
    }
  }
  .toggleDashboardNavbar {
    background: #ffffff;
    box-shadow: 5px 5px 16px #b4b3b3, -5px -5px 16px #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0.5rem;
    z-index: 99999;
    border-radius: 50%;
    margin: -0.5rem auto;
    cursor: pointer;
    transition-timing-function: cubic-bezier(10, 2, 3, 1);

    transition: all ease-in-out 0.3s;
    &:hover {
      border-radius: 150px;
      box-shadow: 5px 5px 15px #a3a2a2, -5px -5px 15px #ffffff;
    }
    @media only screen and (max-width: 855px) {
      transform: translateY(-9vh);
    }
  }
}
</style>
