<script setup>
const props = defineProps({
  availabilityInfos: Object,
});

const emit = defineEmits(["closeAvailability", "refetchEvents"]);

const closeModal = () => {
  emit("closeAvailability");
};

const refetchEvents = () => {
  emit("refetchEvents");
};

const { deleteData } = useApi();

const deleteAvailability = async () => {
  try {
    const response = await deleteData(
      `availabilities/${props.availabilityInfos.id}`
    );
    if (response.success) {
      refetchEvents();
      closeModal();
    }
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <h3>Date de début: {{ props.availabilityInfos.start }}</h3>
  <h3 class="my-1">Date de fin: {{ props.availabilityInfos.end }}</h3>
  <UButton class="mt-5" @click="deleteAvailability">
    Supprimer cette disponibilité
  </UButton>
</template>
