<script setup>
const vendors = ["1", "2", "3"];

const vendor = ref(vendors[0]);
</script>

<template>
  <UFormGroup label="Email" description="We'll only use this for spam.">
    <USelect v-model="vendor" :options="vendors" />
  </UFormGroup>
</template>
