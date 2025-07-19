// apps/web/src/components/features/shopping/cart/cart-item.tsx
'use client';

import {FC} from 'react';
import {useCart} from '@/hooks/shopping/cart/useCart';
import {EnrichedCartItem} from '@/types/generated/graphql';
import Image from 'next/image'
import {Checkbox} from '@/components/ui/checkbox';
import {CheckedState} from '@radix-ui/react-checkbox';
import {Button} from '@/components/ui/button';
import {QuantityInput} from '@/components/ui/quantity-input';

interface CartItemProps {
    item: EnrichedCartItem;
}

export const CartItem: FC<CartItemProps> = ({item}) => {
    const {updateCartItemQuantity, toggleItemSelection, removeFromCart} = useCart();

    const handleQuantityChange = (value: number) => {
        updateCartItemQuantity(item.skuId, value).then();
    };

    const handleSelectionToggle = (isChecked: CheckedState) => {
        if (isChecked !== 'indeterminate') toggleItemSelection(item.skuId, isChecked).then()
    }
    const handleRemove = () => {
        removeFromCart(item.id).then();
    };

    return (
        <div className="flex items-center justify-between p-4 border-b" data-testid="cart-item">
            <div className="flex items-center space-x-4">
                <Checkbox checked={item.selected} onCheckedChange={handleSelectionToggle}/>
            </div>
            <div className="flex items-center space-x-4">
                <div>
                    <h3 className="text-lg font-medium">
                        {item.product?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                        <Image src={item.product?.images[0]?.url || '/avatar.svg'} width={100} height={100}
                               alt={item.product?.name ?? item.productId}/>
                    </p>
                </div>
            </div>
            <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-4">
                    <QuantityInput value={item.quantity} onChange={handleQuantityChange}/>
                    <Button
                        data-testid="remove-item"
                        onClick={handleRemove}
                    >
                        Remove
                    </Button>
                </div>
            </div>
        </div>
    );
};