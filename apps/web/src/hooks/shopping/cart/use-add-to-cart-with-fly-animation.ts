import {MouseEvent, useState} from 'react';
import {useCart} from './use-cart';
import {ProductPrice, Sku} from '@/types/generated/graphql';

export function useAddToCartWithFlyAnimation(imageUrl: string = '/placeholder.jpg') {
    const {addToCart} = useCart();
    const [flyingItem, setFlyingItem] = useState<ReturnType<typeof getFlyingItem> | null>(null);

    function getFlyingItem(
        event: MouseEvent,
        sku: Sku,
        price: ProductPrice,
        index: number
    ) {
        const buttonRect = event.currentTarget.getBoundingClientRect();
        const cartElement = document.getElementById('floating-cart');
        if (!cartElement) return null;
        const cartRect = cartElement.getBoundingClientRect();

        return {
            id: `${sku.id}-${index}`,
            color: sku.color,
            size: sku.size,
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
        sku: Sku,
        price: ProductPrice,
        index: number,
        productId: string,
    ) => {
        const item = getFlyingItem(event, sku, price, index);
        if (!item) return;

        setFlyingItem(item);

        setTimeout(async () => {
            await addToCart({skuId: sku.id, productId, quantity: 1, selected: true});
            setFlyingItem(null);
        }, 600);
    };

    return {
        flyingItem,
        handleAddToCart,
    };
}
