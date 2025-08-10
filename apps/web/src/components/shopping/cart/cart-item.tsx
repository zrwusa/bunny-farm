'use client';

import {FC, useEffect, useState} from 'react';
import {useCart} from '@/hooks/shopping/cart/use-cart';
import {CartQuery} from '@/types/generated/graphql';
import Image from 'next/image';
import {QuantityInput} from '@/components/ui/quantity-input';
import {X} from 'lucide-react';

interface CartItemProps {
    item: CartQuery['cart']['items'][number];
}

export const CartItem: FC<CartItemProps> = ({item}) => {
    const {updateCartItemQuantity, removeFromCart} = useCart();
    const [quantity, setQuantity] = useState(item.quantity);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        setQuantity(item.quantity);
    }, [item.quantity]);

    const handleQuantityChange = (val: number) => {
        setQuantity(val);
    };

    const handleDebouncedQuantityChange = async (val: number) => {
        setIsPending(true);
        await updateCartItemQuantity(item.skuId, val);
        setIsPending(false);
    };

    const handleRemove = () => {
        removeFromCart(item.id).catch(() => {
        });
    };

    return (
        <div className="flex items-start px-2 py-3 border-b last:border-b-0">
            <div className="flex-shrink-0 w-[100px] h-[100px] md:w-[160px] md:h-[160px] flex items-center">
                <Image
                    src={item.product?.images?.[0]?.url || '/avatar.svg'}
                    alt={item.product?.name ?? item.productId}
                    width={160}
                    height={160}
                    className="rounded-md object-cover"
                />
            </div>

            <div className="flex flex-col flex-1 md:pl-6 px-3 h-[100px] md:h-[160px] justify-between">
                <div>
                    <div className="flex items-start justify-between">
                    <span className="font-medium leading-tight line-clamp-1">
                        {item.product?.name}
                    </span>
                        <button
                            onClick={handleRemove}
                            className="p-1 text-gray-400 hover:text-gray-700"
                        >
                            <X className="w-4 h-4"/>
                        </button>
                    </div>

                    <span className="text-xs text-gray-500 mt-0.5">
        {item.sku?.size || ''}
      </span>
                </div>

                <div className="flex items-center justify-between">
      <span className="text-sm font-semibold">
        ${item.sku?.prices[0].price ?? '0.00'} USD
      </span>
                    <QuantityInput
                        value={quantity}
                        onChange={handleQuantityChange}
                        onDebouncedChange={handleDebouncedQuantityChange}
                        min={1}
                        isPending={isPending}
                        className="ml-2"
                    />
                </div>
            </div>
        </div>

    );
};
