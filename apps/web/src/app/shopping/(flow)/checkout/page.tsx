"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    EnrichedCartItem,
    PaymentMethod,
    UserAddress
} from "@/types/generated/graphql";
import {
    getAddressDetail,
    getMyAddresses,
    getSelectedCartItems,
    placeOrder
} from "@/lib/api/client-actions";
import Image from "next/image";
import { Combobox } from "@/components/ui/combobox";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

const AddressFormSchema = z.object({
    road: z.string().min(1, { message: "Street is required" }),
    suburb: z.string().min(1, { message: "Suburb is required" }),
    city: z.string().min(1, { message: "City is required" }),
    postcode: z.string().min(1, { message: "Postcode is required" }),
    country: z.string().min(1, { message: "Country is required" }),
});

export default function CheckoutPage() {
    const router = useRouter();
    const [items, setItems] = useState<EnrichedCartItem[]>([]);
    const [addresses, setAddresses] = useState<UserAddress[]>([]);
    const [inputAddress, setInputAddress] = useState<string>("");
    const [selectedAddress, setSelectedAddress] = useState("");

    const [addressFields, setAddressFields] = useState({
        road: "",
        suburb: "",
        city: "",
        postcode: "",
        country: ""
    });

    const addressForm = useForm<z.infer<typeof AddressFormSchema>>({
        resolver: zodResolver(AddressFormSchema),
        defaultValues: addressFields
    });

    useEffect(() => {
        getMyAddresses().then((addresses) => {
            setAddresses(addresses);
            if (addresses[0]) setSelectedAddress(addresses[0].id);
            getSelectedCartItems().then((items) => setItems(items));
        });
    }, []);

    const handlePlaceOrder = async () => {
        const orderPlaced = await placeOrder({
            items: items.map(({ product: _, ...rest }) => ({ ...rest })),
            addressId: selectedAddress,
            paymentMethod: PaymentMethod.CreditCard
        });
        if (orderPlaced?.id)
            router.push(`/shopping/orders/${orderPlaced.id}/payment`);
    };

    const handleAddressCorrection = async () => {
        const corrected = await getAddressDetail(inputAddress);
        console.log("---corrected", corrected);
        if (corrected?.components) {
            const newFields = {
                road: corrected.components.road || "",
                suburb: corrected.components.suburb || "",
                city: corrected.components.city || "",
                postcode: corrected.components.postcode || "",
                country: corrected.components.country || ""
            };
            setAddressFields(newFields);
            addressForm.reset(newFields); // Use react-hook-form to synchronize the update form value
        }
    };

    const options = addresses.map(
        ({ addressLine1, addressLine2, postalCode, city, country, id }) => ({
            label: `${addressLine1}, ${addressLine2}, ${city}, ${country}, ${postalCode} `,
            value: id
        })
    );

    function onSubmit(data: z.infer<typeof AddressFormSchema>) {
        console.log('---data', data);
        // toast("Address fields submitted", {
        //     description: (
        //         <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
        //   <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        // </pre>
        //     ),
        // });
    }

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

            <Combobox
                options={options}
                value={selectedAddress}
                onValueChange={setSelectedAddress}
                placeholder="Choose an address"
            />

            <Textarea
                className="border-4 mt-4"
                placeholder="Paste an address here — I’ll figure it out for you!"
                onBlur={handleAddressCorrection}
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
            />

            <Form {...addressForm}>
                <form
                    onSubmit={addressForm.handleSubmit(onSubmit)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8"
                >
                    {["road", "suburb", "city", "postcode", "country"].map((fieldName) => (
                        <FormField
                            key={fieldName}
                            control={addressForm.control}
                            name={fieldName as keyof z.infer<typeof AddressFormSchema>}
                            render={({ field }) => (
                                <FormItem className={fieldName === "country" ? "md:col-span-2" : ""}>
                                    <FormLabel>{fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={`Enter ${fieldName}`} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                    <Button type="submit" className="col-span-full w-full">
                        Submit Address
                    </Button>
                </form>
            </Form>

            <Button className="w-full mt-4" onClick={handlePlaceOrder}>
                Place Order
            </Button>
        </div>
    );
}

