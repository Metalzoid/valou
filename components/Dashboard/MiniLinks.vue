<script setup>
const props = defineProps(["links", "status", "date"]);

const emit = defineEmits(["updateDateRef", "updateStatusRef"]);
</script>

<template>
  <ul class="links" ref="linksDiv">
    <li
      v-for="link in props?.links"
      :class="{ active: props.date === link.to }"
      :key="link.id"
      class="cursor-pointer"
      @click="emit('updateDateRef', link.to)"
      v-if="props?.date"
    >
      {{ link.name }}
    </li>
    <UChip
      v-for="{ to, name, chipNumber } in props?.links"
      :key="name"
      :show="chipNumber > 0"
      :text="chipNumber"
      size="2xl"
      v-if="props?.status"
    >
      <li
        :class="{ active: props.status === to }"
        :key="id"
        class="cursor-pointer"
        @click="emit('updateStatusRef', to)"
      >
        {{ name }}
      </li>
    </UChip>
  </ul>
</template>

<style lang="scss" scoped>
.links {
  background-color: white;
  width: 100%;
  min-width: max-content;
  display: flex;
  gap: 1rem;
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
</style>
