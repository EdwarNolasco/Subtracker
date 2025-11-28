import { ref, computed } from 'vue';
import type { Subscription, CreateSubscriptionDTO, UpdateSubscriptionDTO } from '../types/Subscription';

const API_URL = 'http://localhost:3000/api';

// Tasa de conversión fija USD a HNL
const USD_TO_HNL_RATE = 26;

export function useSubscriptions() {
    const subscriptions = ref<Subscription[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Cargar todas las suscripciones
    const fetchSubscriptions = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/subscriptions`);
            if (!response.ok) throw new Error('Error al cargar suscripciones');
            subscriptions.value = await response.json();
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Error desconocido';
            console.error('Error fetching subscriptions:', err);
        } finally {
            loading.value = false;
        }
    };

    // Crear nueva suscripción
    const createSubscription = async (data: CreateSubscriptionDTO) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/subscriptions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Error al crear suscripción');
            const newSubscription = await response.json();
            subscriptions.value.push(newSubscription);
            return newSubscription;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Error desconocido';
            console.error('Error creating subscription:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // Actualizar suscripción
    const updateSubscription = async (id: string, data: UpdateSubscriptionDTO) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/subscriptions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Error al actualizar suscripción');
            const updatedSubscription = await response.json();
            const index = subscriptions.value.findIndex(sub => sub.id === id);
            if (index !== -1) {
                subscriptions.value[index] = updatedSubscription;
            }
            return updatedSubscription;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Error desconocido';
            console.error('Error updating subscription:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // Eliminar suscripción
    const deleteSubscription = async (id: string) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/subscriptions/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Error al eliminar suscripción');
            subscriptions.value = subscriptions.value.filter(sub => sub.id !== id);
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Error desconocido';
            console.error('Error deleting subscription:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // Convertir precio a HNL (moneda base)
    const convertToHNL = (price: number, currency: 'USD' | 'HNL'): number => {
        return currency === 'USD' ? price * USD_TO_HNL_RATE : price;
    };

    // Normalizar precio a costo mensual en HNL
    const normalizeToMonthly = (subscription: Subscription): number => {
        const priceInHNL = convertToHNL(subscription.price, subscription.currency);
        return subscription.frequency === 'Anual' ? priceInHNL / 12 : priceInHNL;
    };

    // Calcular total mensual estimado
    const totalMonthly = computed(() => {
        return subscriptions.value.reduce((total, sub) => {
            return total + normalizeToMonthly(sub);
        }, 0);
    });

    // Calcular total anual estimado
    const totalYearly = computed(() => {
        return totalMonthly.value * 12;
    });

    // Obtener estadísticas por moneda
    const statsByCurrency = computed(() => {
        const stats = {
            USD: { count: 0, total: 0 },
            HNL: { count: 0, total: 0 },
        };

        subscriptions.value.forEach(sub => {
            stats[sub.currency].count++;
            stats[sub.currency].total += normalizeToMonthly(sub);
        });

        return stats;
    });

    return {
        subscriptions,
        loading,
        error,
        fetchSubscriptions,
        createSubscription,
        updateSubscription,
        deleteSubscription,
        totalMonthly,
        totalYearly,
        statsByCurrency,
        convertToHNL,
        normalizeToMonthly,
    };
}
