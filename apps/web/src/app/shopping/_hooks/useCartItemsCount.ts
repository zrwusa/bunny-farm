import {CartSession} from '@/types/generated/graphql';

export function useCartItemsCount(cart: CartSession | null) {
    if (!cart) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
}