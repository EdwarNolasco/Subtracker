export type Currency = 'USD' | 'HNL';

export type Frequency = 'Mensual' | 'Anual';

export interface Subscription {
    id: string;
    name: string;
    price: number;
    currency: Currency;
    frequency: Frequency;
    paymentDate: number; // Día del mes (1-31)
    createdAt: string;
    updatedAt: string;
}

export interface CreateSubscriptionDTO {
    name: string;
    price: number;
    currency: Currency;
    frequency: Frequency;
    paymentDate: number;
}

export interface UpdateSubscriptionDTO {
    name?: string;
    price?: number;
    currency?: Currency;
    frequency?: Frequency;
    paymentDate?: number;
}
