<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
  },
  title: {
    type: String,
  },
});
const emit = defineEmits(["update:isOpen"]);
</script>

<template>
  <UModal :modelValue="isOpen" prevent-close>
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
            {{ props.title }}
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="emit('update:isOpen', false)"
          />
        </div>
      </template>
      <slot></slot>
    </UCard>
  </UModal>
</template>
