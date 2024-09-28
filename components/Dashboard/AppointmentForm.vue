<script setup>
import { format } from "date-fns";
const { updateData } = useApi();
const { $swal } = useNuxtApp();
const allDatasStore = useAllDatasStore();

const emit = defineEmits(["closeModal"]);

const closeModal = () => {
  emit("closeModal");
};

const props = defineProps({
  appointment: Object,
  services: Object,
});

const statusOptions = ref([]);

const defineStatusOptions = (status) => {
  statusOptions.value = [];
  if (status === "accepted") {
    statusOptions.value = [
      {
        name: "Accepté",
        value: "accepted",
      },
      {
        name: "Annuler ?",
        value: "canceled",
      },
    ];
  } else if (status === "refused") {
    statusOptions.value = [
      {
        name: "Accepter ?",
        value: "accepted",
      },
      {
        name: "Refusé",
        value: "refused",
      },
      {
        name: "En attente",
        value: "hold",
      },
    ];
  } else if (status === "hold") {
    statusOptions.value = [
      {
        name: "Accepter ?",
        value: "accepted",
      },
      {
        name: "Refuser",
        value: "refused",
      },
      {
        name: "En attente",
        value: "hold",
      },
    ];
  } else if (status === "canceled") {
    statusOptions.value = [
      {
        name: "Accepter ?",
        value: "accepted",
      },
      {
        name: "En attente",
        value: "hold",
      },
      {
        name: "Annulé",
        value: "canceled",
      },
    ];
  }
};

const state = reactive({
  id: undefined,
  start_date: undefined,
  end_date: undefined,
  comment: undefined,
  sellerComment: undefined,
  status: undefined,
  price: undefined,
  customer: undefined,
  services: undefined,
});

const selected = ref([]);

const driveTime = ref({
  for: null,
  from: null,
});

const driveTimeToggle = ref(false);

const form = ref();

const renderSubmit = (response) => {
  if (response.success) {
    state.id = response.data.data.id;
    $swal.fire({
      title: "Génial!",
      text: "Prestation mise à jour avec succès",
      icon: "success",
    });
    allDatasStore.updateDatas();
    form.value.clear();
    closeModal();
  } else {
    $swal.fire({
      title: "Une erreur est survenue!",
      text: response.data.errors,
      icon: "error",
    });
  }
};

const onSubmit = async () => {
  let formData = buildFormData(state, props.appointment.appointment);

  if (formData) {
    const response = await updateData(`appointments/${state.id}`, formData);
    renderSubmit(response);
  }
};

const buildFormData = (state, props) => {
  let formData = {
    appointment: {},
  };

  Object.keys(state).forEach((key) => {
    if (state[key] !== props[key]) {
      if (["customer", "services"].includes(key) || state[key] === null) {
        return;
      }

      if (["start_date", "end_date"].includes(key)) {
        const propDate = new Date(props[key]);
        const stateDate = new Date(state[key]);

        if (propDate.getTime() !== stateDate.getTime()) {
          formData.appointment[key] = state[key];
        }
        return;
      }

      if (key === "sellerComment") {
        formData.appointment["seller_comment"] = state.sellerComment;
        return;
      }

      formData.appointment[key] = state[key];
    }
  });

  return Object.keys(formData.appointment).length ? formData : null;
};

watch(
  () => props?.appointment,
  (newVal) => {
    selected.value = [];
    const transform = {
      id: newVal.appointment.id,
      start_date: format(
        new Date(newVal.appointment.start_date),
        "yyyy-MM-dd'T'HH:mm"
      ),
      end_date: format(
        new Date(newVal.appointment.end_date),
        "yyyy-MM-dd'T'HH:mm"
      ),
      comment: newVal.appointment.comment,
      sellerComment: newVal.appointment.seller_comment,
      status: newVal.appointment.status,
      price: newVal.appointment.price,
      customer: newVal.user,
      services: newVal.appointment.services,
    };
    Object.assign(state, transform);
    newVal.appointment.services.forEach((service) => {
      selected.value.push(service.id);
    });
    defineStatusOptions(newVal.appointment.status);
  },
  { immediate: true }
);
</script>

<template>
  <UForm ref="form" :state="state" @submit="onSubmit">
    <div class="flex w-full justify-between">
      <UFormGroup
        label="Début de la prestation"
        name="start"
        class="mt-3 w-5/12"
      >
        <UInput
          v-model="state.start_date"
          type="datetime-local"
          :disabled="props?.appointment?.appointment?.status === 'accepted'"
        />
      </UFormGroup>

      <UFormGroup label="Fin de la prestation" name="end" class="mt-3 w-5/12">
        <UInput
          v-model="state.end_date"
          type="datetime-local"
          :disabled="props?.appointment?.appointment?.status === 'accepted'"
        />
      </UFormGroup>
    </div>

    <UButton
      :label="driveTimeToggle ? 'Annuler temps de trajet' : 'Temps de trajet'"
      class="mt-3"
      @click="driveTimeToggle = !driveTimeToggle"
    />
    <div v-if="driveTimeToggle" class="flex w-full justify-between flex-wrap">
      <UFormGroup
        label="Temps de trajet aller"
        name="driveTime"
        class="mt-3 w-5/12"
      >
        <UInput v-model="driveTime.for" type="time" />
      </UFormGroup>

      <UFormGroup
        label="Temps de trajet retour"
        name="driveTime"
        class="mt-3 w-5/12"
      >
        <UInput v-model="driveTime.from" type="time" />
      </UFormGroup>
    </div>

    <UFormGroup label="Commentaire du client" name="comment" class="mt-3">
      <UTextarea v-model="state.comment" type="text" disabled />
    </UFormGroup>

    <UFormGroup
      :label="
        state.sellerComment
          ? 'Modifier votre commentaire'
          : 'Ajouter un commentaire'
      "
      name="sellerComment"
      class="mt-3"
    >
      <UTextarea
        v-model="state.sellerComment"
        class="mt-3 mb-10"
        autoresize
      ></UTextarea>
    </UFormGroup>

    <UFormGroup label="Prestations" name="services" class="mt-3">
      <USelectMenu
        v-model="selected"
        :options="props.services"
        value-attribute="id"
        option-attribute="title"
        multiple
        required
        searchable
      />
    </UFormGroup>

    <UFormGroup label="Prix" name="price" class="mt-5">
      <UInput v-model="state.price" type="number" disabled>
        <template #trailing>
          <span class="text-gray-500 dark:text-gray-400 text-xs">EUR</span>
        </template>
      </UInput>
    </UFormGroup>

    <UFormGroup label="Status" name="status" class="mt-3">
      <USelect
        class="my-5"
        v-model="state.status"
        :options="statusOptions"
        option-attribute="name"
      />
    </UFormGroup>

    <UButton type="submit" class="mt-5">Modifier</UButton>
  </UForm>
</template>
