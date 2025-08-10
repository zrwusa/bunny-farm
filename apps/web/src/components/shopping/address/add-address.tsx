"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

import { AddressFormData, AddressSchema } from "@bunny/shared";
import { useState } from "react";
import {handleFormError} from '@/lib/api/handle-form-error';
import {useAddMyAddress} from '@/hooks/address/use-add-my-address';
import {useAddressDetail} from '@/hooks/address/use-address-detail';

interface AddAddressFormProps {
    onAddressAdded?: () => void;
}

export function AddAddressForm({ onAddressAdded }: AddAddressFormProps) {
    const [inputAddress, setInputAddress] = useState("");

    const form = useForm<AddressFormData>({
        resolver: zodResolver(AddressSchema),
        defaultValues: {
            recipientName: "",
            email: "",
            phone: "",
            addressLine1: "",
            addressLine2: "",
            suburb: "",
            city: "",
            postalCode: "",
            country: "",
            isDefault: false,
        },
    });

    const [addMyAddress, {loading}] = useAddMyAddress();
    const [fetchAddressDetail, { data: addressData }] = useAddressDetail();
    const handleAddressCorrection = async () => {
        if (!inputAddress.trim()) return;

        // Apollo lazy query
        await fetchAddressDetail({
            variables: {
                address: inputAddress
            }
        });

        const corrected = addressData?.placeDetail;

        if (corrected?.components) {
            const values = {
                recipientName: "",
                email: "",
                phone: "",
                addressLine1: corrected.components.road || "",
                addressLine2: "",
                suburb: corrected.components.suburb || "",
                city: corrected.components.city || "",
                postalCode: corrected.components.postcode || "",
                country: corrected.components.country || "",
                isDefault: false,
            };
            form.reset(values);
        }
    };

    const onSubmit = async (data: AddressFormData) => {
        try {
            const res = await addMyAddress({
                variables: {
                    input: data,
                },
            });

            if (res.data?.addMyAddress?.id) {
                form.reset();
                setInputAddress("");
                onAddressAdded?.();
            }
        } catch (e: unknown) {
            handleFormError(e, form.setError)
        }
    };

    return (
        <>
            <Textarea
                className="border-4 mt-4"
                placeholder="Paste an address here — I’ll figure it out for you!"
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
                onBlur={handleAddressCorrection}
            />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8"
                >
                    {[
                        "recipientName",
                        "phone",
                        "email",
                        "addressLine1",
                        "addressLine2",
                        "suburb",
                        "city",
                        "postalCode",
                        "country",
                    ].map((fieldName) => (
                        <FormField
                            key={fieldName}
                            control={form.control}
                            name={fieldName as keyof Omit<AddressFormData, "isDefault">}
                            render={({ field }) => (
                                <FormItem
                                    className={
                                        ["addressLine2", "suburb", "country"].includes(fieldName)
                                            ? "md:col-span-2"
                                            : ""
                                    }
                                >
                                    <FormLabel>{fieldName}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={`Enter ${fieldName}`} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}

                    <FormField
                        control={form.control}
                        name="isDefault"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 md:col-span-2">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Set as default address</FormLabel>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="col-span-full w-full" disabled={loading}>
                        Submit New Address
                    </Button>
                </form>
            </Form>
        </>
    );
}
