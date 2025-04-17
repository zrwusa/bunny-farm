import {MouseEvent, useState} from 'react';
import {useCart} from './useCart';
import {ProductPrice, ProductVariant} from '@/types/generated/graphql';

export function useAddToCartWithFlyAnimation(imageUrl: string = '/placeholder.jpg') {
    const {addToCart} = useCart();
    const [flyingItem, setFlyingItem] = useState<ReturnType<typeof getFlyingItem> | null>(null);

    function getFlyingItem(
        event: MouseEvent,
        variant: ProductVariant,
        price: ProductPrice,
        index: number
    ) {
        const buttonRect = event.currentTarget.getBoundingClientRect();
        const cartElement = document.getElementById('floating-cart');
        if (!cartElement) return null;
        const cartRect = cartElement.getBoundingClientRect();

        return {
            id: `${variant.id}-${index}`,
            color: variant.color,
            size: variant.size,
            price: price.price,
            imageUrl,
            startX: buttonRect.left,
            startY: buttonRect.top,
            cartX: cartRect.left,
            cartY: cartRect.top,
        };
    }

    const handleAddToCart = async (
        event: MouseEvent,
        variant: ProductVariant,
        price: ProductPrice,
        index: number
    ) => {
        const item = getFlyingItem(event, variant, price, index);
        if (!item) return;

        setFlyingItem(item);

        setTimeout(async () => {
            await addToCart(variant.id, variant.id, 1);
            setFlyingItem(null);
        }, 600);
    };

    return {
        flyingItem,
        handleAddToCart,
    };
}
