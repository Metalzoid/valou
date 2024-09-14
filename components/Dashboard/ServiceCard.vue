<script setup>
const { $swal } = useNuxtApp();

const { updateData } = useApi();
const props = defineProps({
  service: Object,
});

const emit = defineEmits(["updateService"]);

const updateService = (service) => {
  emit("updateService", service);
};

const disabled = ref(props.service?.disabled);

const updateServiceModal = ref(false);

const closeUpdateService = () => {
  updateServiceModal.value = false;
};

const updateStatusService = async () => {
  let formData = {
    service: {
      disabled: !disabled.value,
    },
  };
  const response = await updateData(`services/${props.service?.id}`, formData);

  if (response.success) {
    disabled.value = !disabled.value;
    $swal.fire({
      title: "Génial!",
      text: "Status mis à jour.",
      icon: "success",
    });
  } else {
    $swal.fire({
      title: "Une erreur est survenue!",
      text: `Contactez l'administrateur du site. Erreur: ${response.error.message}`,
      icon: "error",
    });
  }
};
</script>

<template>
  <Modal
    :isOpen="updateServiceModal"
    :title="`Modifier une prestation`"
    @update:isOpen="(value) => (updateServiceModal = value)"
  >
    <DashboardServiceForm
      @closeModal="closeUpdateService"
      @updateService="updateService"
      method="update"
      :service="props.service"
    />
  </Modal>
  <div class="card">
    <div class="flex justify-between w-full items-start">
      <h1 class="font-mono text-3xl text-indigo-700">
        {{ props.service?.title }}
      </h1>
      <font-awesome-icon
        :icon="['fas', 'pen']"
        @click="updateServiceModal = true"
        class="cursor-pointer"
      />
    </div>
    <UDivider />
    <div class="flex justify-between w-full">
      <p>
        <font-awesome-icon :icon="['fas', 'clock']" style="color: #a9a9a9" />
        {{ props.service?.time }} minutes
      </p>
      <div class="flex gap-8 items-center">
        <p>{{ props.service?.price }} €</p>
        <UPopover mode="hover">
          <font-awesome-icon
            :icon="['fas', `${disabled ? 'circle-xmark' : 'circle-check'}`]"
            @click="updateStatusService"
          />
          <template #panel>
            <div class="p-4" v-if="!disabled">
              Actuellement actif ! Cliquez pour désactiver.
            </div>
            <div class="p-4" v-if="disabled">
              Actuellement inactif ! Cliquez pour réactiver.
            </div>
          </template>
        </UPopover>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30vw;
  background-color: white;
  margin: 2rem 0;
  padding: 1rem;
  border-radius: 1rem;
  gap: 1rem;
  box-shadow: 4px 4px 10px rgba(1, 1, 1, 0.2);
}
</style>
