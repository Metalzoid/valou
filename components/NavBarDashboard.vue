<script setup>
const route = useRoute();

const props = defineProps(["links", "width"]);

const toggleDashboardNavbar = ref(true);
const linksDiv = ref(null);
const arrowToggle = ref(null);
const displayToggle = ref(false);
const navbarHeight = ref(null);

const updateWidth = () => {
  window.innerWidth < "856"
    ? (displayToggle.value = true)
    : (displayToggle.value = false);
};

const updateNavbarHeight = () => {
  const navbar = document.getElementById("navigation");
  navbarHeight.value = navbar.clientHeight;
  linksDiv.value.parentNode.style.top = `${navbarHeight.value}px`;
};

const toggle = () => {
  const body = document.getElementById("mainDashboard");
  if (toggleDashboardNavbar.value === true) {
    body.style.transform = `translateY(${linksDiv.value.clientHeight}px)`;
    toggleDashboardNavbar.value = false;
    linksDiv.value.style.transform = "translateY(0vh)";
    arrowToggle.value.style.transform = `translateY(${linksDiv.value.clientHeight}px) rotate(180deg)`;
  } else {
    body.style.transform = `translateY(0px)`;
    toggleDashboardNavbar.value = true;
    linksDiv.value.style.transform = "translateY(-100vh)";
    arrowToggle.value.style.transform = `translateY(0px) rotate(0deg)`;
  }
};

onMounted(() => {
  updateWidth();
  updateNavbarHeight();
  window.addEventListener("resize", updateWidth);
  window.addEventListener("resize", updateNavbarHeight);
  linksDiv.value.parentNode.style.top = `${navbarHeight.value}px`;
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
  window.removeEventListener("resize", updateNavbarHeight);
});
</script>

<template>
  <div class="container">
    <ul class="links" ref="linksDiv" :style="{ width: `${props.width}%` }">
      <UChip
        v-for="{ to, fullpath, name, chipNumber } in props.links"
        :key="name"
        :show="chipNumber > 0"
        :text="chipNumber"
        size="2xl"
      >
        <NuxtLink
          :to="to"
          :class="{
            active: fullpath.some((path) => path === route.fullPath),
          }"
        >
          {{ name }}
        </NuxtLink>
      </UChip>
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
  display: flex;
  width: 100vw;
  flex-direction: column;
  align-items: center;
  @media only screen and (max-width: 855px) {
    position: absolute;
    margin: 0;
    max-width: 100vw;
  }
  .links {
    display: flex;
    justify-content: space-evenly;
    background-color: white;
    min-width: fit-content;
    border-radius: 0.7rem;
    padding: 0.7rem;
    box-shadow: 4px 4px 10px rgba(1, 1, 1, 0.2);
    transition-timing-function: cubic-bezier(10, 2, 3, 1);
    transition: all ease-in-out 0.3s;
    @media only screen and (max-width: 855px) {
      transform: translateY(-100vh);
    }
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
    @media only screen and (max-width: 855px) {
      transform: translateY(-18vh);
      position: absolute;
      margin: 0 auto;
    }
  }
  .toggleDashboardNavbar {
    position: fixed;
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
    transform: translateY(0px);

    transition: all ease-in-out 0.3s;
    &:hover {
      border-radius: 150px;
      box-shadow: 5px 5px 15px #a3a2a2, -5px -5px 15px #ffffff;
    }
  }
}
</style>
