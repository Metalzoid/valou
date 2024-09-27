<script setup>
onMounted(() => {
  const userStore = useUserStore();
  if (userStore.currentUser) {
    const allDatasStore = useAllDatasStore();
    allDatasStore.updateDatas();
  }
});
</script>

<template>
  <div class="text-black">
    <Navbar />
    <NuxtPage />
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
