'use client'

import {createProductViaClient} from '@/lib/api/client-actions';
import {useActionState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card} from '@/components/ui/card';
import {Product} from '@/types/generated/graphql';

export const ProductFormClient = () => {
    const [state, createProductAction, isPending] = useActionState(
        async (prevState: Product, formData: FormData) => {
            const newState = {
                ...prevState,
                ...Object.fromEntries(formData.entries())
            };
            await createProductViaClient(newState, formData);
            return newState;
        },
        {
            name: 'Megamax Reciprocating saw head',
            brand: {
                name: 'Ridgid',
                id: 'xxx',
                products: [],
                description: '',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            description: {type: 'doc', text: 'Megamax Reciprocating saw head'}
        } as unknown as Product
    );

    return (
        <Card className="p-4">
            <form action={createProductAction}>
                <Input type="text" defaultValue={state.name} name="name" id="name" placeholder="name"/>
                <Input type="text" defaultValue={state.brand?.name} name="brand" id="brand" placeholder="brand"/>
                <Input type="number" defaultValue={state.skus?.[0].prices[0].price} name="price" id="price"
                       placeholder="price"/>
                <Input type="text" defaultValue={JSON.stringify(state.description)} name="description" id="description"
                       placeholder="description"/>
                <Button type="submit" disabled={isPending}>Client Submit</Button>
            </form>
        </Card>
    );
}

export default ProductFormClient;
