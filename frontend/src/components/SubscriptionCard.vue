<script setup lang="ts">
import type { Subscription } from '../types/Subscription';

interface Props {
  subscription: Subscription;
}

interface Emits {
  (e: 'edit', subscription: Subscription): void;
  (e: 'delete', id: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('es-HN', {
    style: 'currency',
    currency: currency === 'USD' ? 'USD' : 'HNL',
    minimumFractionDigits: 2,
  }).format(amount);
};

const getFrequencyBadgeColor = (frequency: string) => {
  return frequency === 'Mensual' 
    ? 'bg-blue-100 text-blue-800' 
    : 'bg-purple-100 text-purple-800';
};

const getCurrencyBadgeColor = (currency: string) => {
  return currency === 'USD' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-orange-100 text-orange-800';
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200">
    <div class="flex justify-between items-start mb-4">
      <h3 class="text-xl font-bold text-gray-800 truncate flex-1">
        {{ subscription.name }}
      </h3>
      <div class="flex gap-2 ml-2">
        <button
          @click="emit('edit', subscription)"
          class="text-blue-600 hover:text-blue-800 transition-colors p-2 hover:bg-blue-50 rounded-full"
          title="Editar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button
          @click="emit('delete', subscription.id)"
          class="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded-full"
          title="Eliminar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <div class="mb-4">
      <div class="text-3xl font-bold text-gray-900">
        {{ formatCurrency(subscription.price, subscription.currency) }}
      </div>
    </div>

    <div class="flex gap-2 mb-4">
      <span :class="getFrequencyBadgeColor(subscription.frequency)" class="px-3 py-1 rounded-full text-xs font-semibold">
        {{ subscription.frequency }}
      </span>
      <span :class="getCurrencyBadgeColor(subscription.currency)" class="px-3 py-1 rounded-full text-xs font-semibold">
        {{ subscription.currency }}
      </span>
    </div>

    <div class="text-sm text-gray-600 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
      </svg>
      <span>Día de pago: {{ subscription.paymentDate }}</span>
    </div>
  </div>
</template>
