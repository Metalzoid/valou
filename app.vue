<script setup>
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
</script>

<template>
  <div class="text-black">
    <FlashMessage class="fixed top-12 left-0 right-0" style="z-index: 10000" />
    <Navbar :user="user" />
    <NuxtPage />
    <UModals />
    <div id="toTopButton" @click="scrollToTop()">
      <font-awesome-icon :icon="['fas', 'arrow-up']" style="color: black" />
    </div>
  </div>
</template>

<style lang="scss">
body {
  margin: 0 auto 0 15vw;
  background-color: rgb(244 244 245);
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
}
</style>
