'use client';

import {useEffect, useMemo, useState} from 'react';
import {Button} from '@/components/ui/button';
import {EnrichedCartItem, PaymentMethod, Query} from '@/types/generated/graphql';
import {Combobox} from '@/components/ui/combobox';
import {useRouter} from 'next/navigation';
import {AddAddressForm} from '@/components/shopping/address/add-address';
import {useMyAddresses} from '@/hooks/address/use-my-addresses';
import {usePlaceOrder} from '@/hooks/order/use-place-order';

type CheckoutProps = {
    addresses: Query['myAddresses'];
    items: EnrichedCartItem[];
};

export default function Checkout({addresses, items}: CheckoutProps) {
    const router = useRouter();

    const {
        data,
        loading: addressLoading,
        refetch,
    } = useMyAddresses({ initialData: {myAddresses: addresses } }); // Support initialData
    const [selectedAddress, setSelectedAddress] = useState<string>('');
    const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);
    const [placeOrder, {loading: placingOrder}] = usePlaceOrder();

    const addressList = useMemo(() => data?.myAddresses ?? [],[data?.myAddresses])

    // Set the default address
    useEffect(() => {
        if (addressList.length > 0) {
            const defaultAddr = addressList.find(addr => addr.isDefault);
            if (defaultAddr) setSelectedAddress(defaultAddr.id);
        }
    }, [addressList]);

    const options = useMemo(() => {
        return addressList.map(
            ({addressLine1, addressLine2, postalCode, city, country, id}) => ({
                label: `${addressLine1}${addressLine2 ? ', ' + addressLine2 : ''}, ${city}, ${country}, ${postalCode}`,
                value: id,
            })
        );
    }, [addressList]);

    const handlePlaceOrder = async () => {
        const {data} = await placeOrder({
            variables: {
                placeOrderInput: {
                    items: items.map(({product: _, ...rest}) => ({...rest})),
                    addressId: selectedAddress,
                    paymentMethod: PaymentMethod.CreditCard,
                }
            }
        });

        if (data?.placeOrder?.id) {
            router.push(`/shopping/orders/${data.placeOrder.id}/payment`);
        }
    };

    return (
        <>
            {!addressLoading && addressList.length > 0 && (
                <>
                    <Combobox
                        options={options}
                        value={selectedAddress}
                        onValueChange={setSelectedAddress}
                        placeholder="Choose an address"
                    />

                    <Button
                        className="mt-4"
                        variant={isEditingAddress ? 'destructive' : 'outline'}
                        onClick={() => setIsEditingAddress((prev) => !prev)}
                    >
                        {isEditingAddress ? 'Cancel' : 'Add New Address'}
                    </Button>
                </>
            )}

            {isEditingAddress && (
                <AddAddressForm onAddressAdded={() => refetch()} />
            )}

            <Button className="w-full mt-4" onClick={handlePlaceOrder} disabled={placingOrder}>
                Place Order
            </Button>
        </>
    );
}
