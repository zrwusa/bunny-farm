'use client'

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Product} from '@/types/generated/graphql';
import {createProductClient} from '@/lib/api/client-actions';
import {objToGraphQLString} from '@/utils';
import {createProduct} from '@/lib/api/actions';
import {useActionState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card} from '@/components/ui/card';

interface ProductFormData {
    name: string;
    brand: string;
    price: number;
    description: string;
}

export const ProductFormClient = () => {
    const [state, createProductAction, isPending] = useActionState(
        async (prevState: ProductFormData, formData: FormData) => {
            const newState = {
                ...prevState,
                ...Object.fromEntries(formData.entries())
            };
            await createProductClient(newState as any, formData);
            return newState;
        },
        {
            name: 'Megamax Reciprocating saw head',
            brand: 'Ridgid',
            price: 698.36,
            description: 'Megamax Reciprocating saw head'
        }
    );

    return (
        <Card className="p-4">
            <form action={createProductAction}>
                <Input type="text" defaultValue={state.name} name="name" id="name" placeholder="name"/>
                <Input type="text" defaultValue={state.brand} name="brand" id="brand" placeholder="brand"/>
                <Input type="number" defaultValue={state.price} name="price" id="price" placeholder="price"/>
                <Input type="text" defaultValue={state.description} name="description" id="description"
                       placeholder="description"/>
                <Button type="submit" disabled={isPending}>Client Submit</Button>
            </form>
        </Card>
    );
}

export default ProductFormClient;
