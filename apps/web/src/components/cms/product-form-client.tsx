'use client';

import {useActionState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card} from '@/components/ui/card';
import {CreateProductInput} from '@/types/generated/graphql';
import {useCreateProduct} from '@/hooks/product/use-create-product';

const initialProductInput: CreateProductInput = {
    name: 'Megamax Reciprocating saw head',
    description: {type: 'doc', text: 'Megamax Reciprocating saw head'},
    brandId: 'xxx',
    price:0,
};

export const ProductFormClient = () => {
    const [createProduct] = useCreateProduct();

    const [state, createProductAction, isPending] = useActionState(
        async (prevState: CreateProductInput, formData: FormData): Promise<CreateProductInput> => {
            const formEntries = Object.fromEntries(formData.entries());

            const productInput: CreateProductInput = {
                ...prevState,
                ...formEntries,
                name: formEntries.name as string,
                description: JSON.parse(formEntries.description as string),
                brandId: prevState.brandId,
            };

            try {
                const {data} = await createProduct({
                    variables: {
                        createProductInput: productInput,
                    },
                });

                const created = data?.createProduct;
                return created?.id ? productInput : prevState;
            } catch (error) {
                console.error('Create product failed:', error);
                return productInput;
            }
        },
        initialProductInput
    );

    return (
        <Card className="p-4">
            <form action={createProductAction}>
                <Input type="text" defaultValue={state.name} name="name" id="name" placeholder="name" />
                {/*<Input type="text" defaultValue={state.brand?.name} name="brand" id="brand" placeholder="brand" />*/}
                <Input
                    type="number"
                    defaultValue={state.price}
                    name="price"
                    id="price"
                    placeholder="price"
                />
                <Input
                    type="text"
                    defaultValue={JSON.stringify(state.description)}
                    name="description"
                    id="description"
                    placeholder="description"
                />
                <Button type="submit" disabled={isPending}>
                    Client Submit
                </Button>
            </form>
        </Card>
    );
};

export default ProductFormClient;
