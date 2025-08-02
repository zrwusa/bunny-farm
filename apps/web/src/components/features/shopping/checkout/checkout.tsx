'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {EnrichedCartItem, PaymentMethod, UserAddress} from '@/types/generated/graphql';
import {getMyAddressesViaClient, placeOrderViaClient} from '@/lib/api/client-actions';
import {Combobox} from '@/components/ui/combobox';
import {useRouter} from 'next/navigation';
import {AddAddressForm} from '@/components/features/address/add-address';

type CheckoutProps = {
    addresses: UserAddress[];
    items: EnrichedCartItem[];
};

export default function Checkout({addresses, items}: CheckoutProps) {
    const [selectedAddress, setSelectedAddress] = useState<string>(addresses.filter(address=> address.isDefault)[0].id || '');
    const [isEditingAddress, setIsEditingAddress] = useState<boolean>(addresses.length === 0);
    const [addressList, setAddressList] = useState<UserAddress[]>(addresses);
    const router = useRouter();

    const handlePlaceOrder = async () => {
        const orderPlaced = await placeOrderViaClient({
            items: items.map(({product: _, ...rest}) => ({...rest})),
            addressId: selectedAddress,
            paymentMethod: PaymentMethod.CreditCard,
        });
        if (orderPlaced?.id) router.push(`/shopping/orders/${orderPlaced.id}/payment`);
    };

    const refreshAddresses = async () => {
        const updated = await getMyAddressesViaClient();
        if (updated) {
            setAddressList(updated);
            const defaultAddress = updated.filter(address => address.isDefault)[0];
            if (defaultAddress) setSelectedAddress(defaultAddress.id);
            setIsEditingAddress(false);
        }
    };

    const options = addressList.map(
        ({addressLine1, addressLine2, postalCode, city, country, id}) => ({
            label: `${addressLine1}${addressLine2 ? ', ' + addressLine2 : ''}, ${city}, ${country}, ${postalCode}`,
            value: id,
        })
    );

    return (
        <>
            {addresses.length > 0 && (
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
                <AddAddressForm onAddressAdded={refreshAddresses}/>
            )}

            <Button className="w-full mt-4" onClick={handlePlaceOrder}>
                Place Order
            </Button>
        </>
    );
}
