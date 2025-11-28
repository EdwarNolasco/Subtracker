<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SubscriptionCard from './SubscriptionCard.vue';
import SubscriptionForm from './SubscriptionForm.vue';
import { useSubscriptions } from '../composables/useSubscriptions';
import type { Subscription, CreateSubscriptionDTO } from '../types/Subscription';

const {
  subscriptions,
  loading,
  error,
  fetchSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  totalMonthly,
  totalYearly,
} = useSubscriptions();

const isFormOpen = ref(false);
const editingSubscription = ref<Subscription | undefined>(undefined);

onMounted(() => {
  fetchSubscriptions();
});

const openCreateForm = () => {
  editingSubscription.value = undefined;
  isFormOpen.value = true;
};

const openEditForm = (subscription: Subscription) => {
  editingSubscription.value = subscription;
  isFormOpen.value = true;
};

const closeForm = () => {
  isFormOpen.value = false;
  editingSubscription.value = undefined;
};

const handleSubmit = async (data: CreateSubscriptionDTO) => {
  try {
    if (editingSubscription.value) {
      await updateSubscription(editingSubscription.value.id, data);
    } else {
      await createSubscription(data);
    }
    closeForm();
  } catch (err) {
    console.error('Error submitting form:', err);
  }
};

const handleDelete = async (id: string) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta suscripción?')) {
    try {
      await deleteSubscription(id);
    } catch (err) {
      console.error('Error deleting subscription:', err);
    }
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-HN', {
    style: 'currency',
    currency: 'HNL',
    minimumFractionDigits: 2,
  }).format(amount);
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- Header con estadísticas -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-4xl font-bold mb-2">💰 SubTracker</h1>
            <p class="text-blue-100">Gestiona tus suscripciones y controla tus gastos</p>
          </div>
          <button
            @click="openCreateForm"
            class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            + Nueva Suscripción
          </button>
        </div>

        <!-- Estadísticas -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 border border-white border-opacity-30">
            <div class="text-sm text-blue-100 mb-1">Gasto Mensual Estimado</div>
            <div class="text-3xl font-bold">{{ formatCurrency(totalMonthly) }}</div>
          </div>
          <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 border border-white border-opacity-30">
            <div class="text-sm text-blue-100 mb-1">Gasto Anual Estimado</div>
            <div class="text-3xl font-bold">{{ formatCurrency(totalYearly) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <span>{{ error }}</span>
        </div>
      </div>

      <!-- Lista vacía -->
      <div v-else-if="subscriptions.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4">📋</div>
        <h2 class="text-2xl font-bold text-gray-700 mb-2">No tienes suscripciones</h2>
        <p class="text-gray-500 mb-6">Comienza agregando tu primera suscripción</p>
        <button
          @click="openCreateForm"
          class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
        >
          + Agregar Suscripción
        </button>
      </div>

      <!-- Grid de suscripciones -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SubscriptionCard
          v-for="subscription in subscriptions"
          :key="subscription.id"
          :subscription="subscription"
          @edit="openEditForm"
          @delete="handleDelete"
        />
      </div>
    </div>

    <!-- Modal de formulario -->
    <SubscriptionForm
      :is-open="isFormOpen"
      :subscription="editingSubscription"
      @close="closeForm"
      @submit="handleSubmit"
    />
  </div>
</template>
