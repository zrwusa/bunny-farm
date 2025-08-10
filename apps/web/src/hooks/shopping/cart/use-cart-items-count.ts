import {CartQuery} from '@/types/generated/graphql';

export function useCartItemsCount(cart: CartQuery['cart'] | null) {
    if (!cart) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
}