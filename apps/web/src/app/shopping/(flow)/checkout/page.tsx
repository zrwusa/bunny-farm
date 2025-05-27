'use client';

import {useEffect, useState} from 'react';
import {EnrichedCartItem, PaymentMethod, UserAddress} from '@/types/generated/graphql';
import {getAddressDetail, getMyAddresses, getSelectedCartItems, placeOrder} from '@/lib/api/client-actions';
import {Button} from '@/components/ui/button';
import Image from 'next/image';
import {Combobox} from '@/components/features/combobox';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {Textarea} from '@/components/ui/textarea';

export default function CheckoutPage() {
    const router = useRouter();
    const [items, setItems] = useState<EnrichedCartItem[]>([]);
    const [addresses, setAddresses] = useState<UserAddress[]>([]);
    const [inputAddress, setInputAddress] = useState<string>('');

    const [selectedAddress, setSelectedAddress] = useState("");

    useEffect(() => {
        getMyAddresses().then((addresses) => {
            setAddresses(addresses);
            if(addresses[0]) setSelectedAddress(addresses[0].id);
            getSelectedCartItems().then((items) => setItems(items));
        })
    }, []);

    const handlePlaceOrder = async () => {
        const orderPlaced = await placeOrder({
            items: items.map(({product: _, ...rest}) => ({...rest})),
            addressId: selectedAddress,
            paymentMethod: PaymentMethod.CreditCard
        })
        if (orderPlaced.id) router.push(`/shopping/orders/${orderPlaced.id}/payment`);
    }

    const handleAddressCorrection = async () => {
        const corrected = await getAddressDetail(inputAddress);
        console.log('---corrected', corrected);
    }
    const options = addresses.map(({addressLine1, addressLine2, postalCode, city, country, id}) => ({label: `${addressLine1}, ${addressLine2}, ${city}, ${country}, ${postalCode} `, value: id}))

    return (
        <div className="mx-auto max-w-4xl">
            <h1 className="mb-8 text-3xl font-bold">Items</h1>
            <ul>
                {
                    items.map(({skuId, quantity, product}) =>
                        <li key={skuId} className="flex justify-between items-center">
                            <div>
                                <Image src={product?.images[0]?.url || '/avatar.svg'} width={200} height={200}
                                       alt={skuId}/>
                                <p> {product?.name}</p>
                            </div>

                            <span> X {quantity}</span>
                        </li>)
                }
            </ul>
            <Combobox
                options={options}
                value={selectedAddress}
                onValueChange={setSelectedAddress}
                placeholder="chose an address"
            />
            <Textarea className="border-4" placeholder="Paste or edit address..." onBlur={handleAddressCorrection} onChange={(e) => setInputAddress(e.target.value)}></Textarea>
            <Button onClick={handlePlaceOrder}>Place Order</Button>

            <Link
                href="/shopping/orders/801374269611543231/payment"
                className="block w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-center"
            >
                Pay
            </Link>
        </div>
    );
}