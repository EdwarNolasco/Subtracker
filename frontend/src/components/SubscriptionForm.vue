<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Subscription, CreateSubscriptionDTO, Currency, Frequency } from '../types/Subscription';

interface Props {
  subscription?: Subscription;
  isOpen: boolean;
}

interface Emits {
  (e: 'close'): void;
  (e: 'submit', data: CreateSubscriptionDTO): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formData = ref<CreateSubscriptionDTO>({
  name: '',
  price: 0,
  currency: 'HNL',
  frequency: 'Mensual',
  paymentDate: 1,
});

// Resetear o llenar el formulario cuando cambia la suscripción
watch(() => props.subscription, (newSub) => {
  if (newSub) {
    formData.value = {
      name: newSub.name,
      price: newSub.price,
      currency: newSub.currency,
      frequency: newSub.frequency,
      paymentDate: newSub.paymentDate,
    };
  } else {
    resetForm();
  }
}, { immediate: true });

const resetForm = () => {
  formData.value = {
    name: '',
    price: 0,
    currency: 'HNL',
    frequency: 'Mensual',
    paymentDate: 1,
  };
};

const handleSubmit = () => {
  if (!formData.value.name || formData.value.price <= 0) {
    alert('Por favor completa todos los campos correctamente');
    return;
  }
  emit('submit', { ...formData.value });
  resetForm();
};

const handleClose = () => {
  resetForm();
  emit('close');
};
</script>

<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" @click.self="handleClose">
      <div class="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 transform transition-all">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">
            {{ subscription ? 'Editar Suscripción' : 'Nueva Suscripción' }}
          </h2>
          <button
            @click="handleClose"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Nombre -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la suscripción
            </label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              placeholder="Ej: Netflix, Spotify, Gimnasio..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <!-- Precio -->
          <div>
            <label for="price" class="block text-sm font-medium text-gray-700 mb-1">
              Precio
            </label>
            <input
              id="price"
              v-model.number="formData.price"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="0.00"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <!-- Moneda -->
          <div>
            <label for="currency" class="block text-sm font-medium text-gray-700 mb-1">
              Moneda
            </label>
            <select
              id="currency"
              v-model="formData.currency"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="HNL">HNL (Lempiras)</option>
              <option value="USD">USD (Dólares)</option>
            </select>
          </div>

          <!-- Frecuencia -->
          <div>
            <label for="frequency" class="block text-sm font-medium text-gray-700 mb-1">
              Frecuencia de pago
            </label>
            <select
              id="frequency"
              v-model="formData.frequency"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="Mensual">Mensual</option>
              <option value="Anual">Anual</option>
            </select>
          </div>

          <!-- Día de pago -->
          <div>
            <label for="paymentDate" class="block text-sm font-medium text-gray-700 mb-1">
              Día de pago (1-31)
            </label>
            <input
              id="paymentDate"
              v-model.number="formData.paymentDate"
              type="number"
              min="1"
              max="31"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <!-- Botones -->
          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="handleClose"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              {{ subscription ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.9);
}
</style>
