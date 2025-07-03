"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { EnrichedCartItem, PaymentMethod, UserAddress } from "@/types/generated/graphql";
import {
    getMyAddresses,
    getSelectedCartItems,
    placeOrder,
} from '@/lib/api/client-actions';

import Image from "next/image";
import { Combobox } from "@/components/ui/combobox";
import { useRouter } from "next/navigation";
import { AddAddressForm } from '@/components/features/address/add-address';

export default function CheckoutPage() {
    const router = useRouter();
    const [items, setItems] = useState<EnrichedCartItem[]>([]);
    const [addresses, setAddresses] = useState<UserAddress[]>([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        getMyAddresses().then((addresses) => {
            setAddresses(addresses);
            if (addresses[0]) setSelectedAddress(addresses[0].id);
        });

        getSelectedCartItems().then((items) => setItems(items));
    }, []);

    const handlePlaceOrder = async () => {
        const orderPlaced = await placeOrder({
            items: items.map(({ product: _, ...rest }) => ({ ...rest })),
            addressId: selectedAddress,
            paymentMethod: PaymentMethod.CreditCard,
        });
        if (orderPlaced?.id) router.push(`/shopping/orders/${orderPlaced.id}/payment`);
    };

    const refreshAddresses = async () => {
        const updated = await getMyAddresses();
        setAddresses(updated);
        if (updated[0]) setSelectedAddress(updated[0].id);
        setShowForm(false);
    };

    const options = addresses.map(
        ({ addressLine1, addressLine2, postalCode, city, country, id }) => ({
            label: `${addressLine1}${addressLine2 ? ", " + addressLine2 : ""}, ${city}, ${country}, ${postalCode}`,
            value: id,
        })
    );

    return (
        <div className="mx-auto max-w-4xl p-6">
            <h1 className="mb-8 text-3xl font-bold">Items</h1>

            <ul className="mb-8">
                {items.map(({ skuId, quantity, product }) => (
                    <li key={skuId} className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4">
                            <Image
                                src={product?.images[0]?.url || "/avatar.svg"}
                                width={100}
                                height={100}
                                alt={skuId}
                                className="rounded"
                            />
                            <p>{product?.name}</p>
                        </div>
                        <span>X {quantity}</span>
                    </li>
                ))}
            </ul>

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
                        variant={showForm ? "destructive" : "outline"}
                        onClick={() => setShowForm((prev) => !prev)}
                    >
                        {showForm ? "Cancel" : "Add New Address"}
                    </Button>
                </>
            )}

            {(addresses.length === 0 || showForm) && (
                <AddAddressForm onAddressAdded={refreshAddresses} />
            )}

            <Button className="w-full mt-4" onClick={handlePlaceOrder}>
                Place Order
            </Button>
        </div>
    );
}
