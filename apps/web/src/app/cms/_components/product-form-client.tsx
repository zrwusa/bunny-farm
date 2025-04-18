'use client'

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Product} from '@/store/app';
import {createProductClient} from '@/lib/api/client-actions';
import {objToGraphQLString} from '@/utils';
import {createProductASCC} from '@/lib/api/actions';
import {useActionState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card} from '@/components/ui/card';


export const ProductFormClient = () => {


    const [{
        id,
        name,
        brand,
        price,
        description
    }, createProductAction, isPending] = useActionState(createProductClient, {
        name: 'Megamax Reciprocating saw head',
        brand: 'Ridgid',
        price: 698.36,
        description: 'Megamax Reciprocating saw head'
    })


    const [stateSACC, createProductActionSACC, isPendingSACC] = useActionState(createProductASCC, {
        name: 'SACC Reciprocating saw head',
        brand: 'SACC Ridgid',
        price: 698.36,
        description: 'SACC Reciprocating saw head'
    })

    return (
        <>
            <Card className="p-4">
                <form action={createProductAction}>
                    <Input type="text" defaultValue={name} name="name" id="name" placeholder="name"/>
                    <Input type="text" defaultValue={brand} name="brand" id="brand" placeholder="brand"/>
                    <Input type="text" defaultValue={price} name="price" id="price" placeholder="price"/>
                    <Input type="text" defaultValue={description} name="description" id="description"
                           placeholder="description"/>
                    <Button type="submit" disabled={isPending}>Client Submit</Button>
                </form>
                <h2>{id ? 'Product Created Successfully' : ''}</h2>
            </Card>

            <Card className="p-4">
                <form action={createProductActionSACC}>
                    <Input type="text" defaultValue={stateSACC.name} name="name" id="name" placeholder="name"/>
                    <Input type="text" defaultValue={stateSACC.brand} name="brand" id="brand" placeholder="brand"/>
                    <Input type="text" defaultValue={stateSACC.price} name="price" id="price" placeholder="price"/>
                    <Input type="text" defaultValue={stateSACC.description} name="description" id="description"
                           placeholder="description"/>
                    <Button type="submit" disabled={isPendingSACC}>Client Submit SACC</Button>
                    <h2>{stateSACC.id ? 'Product Created Successfully SACC' : ''}</h2>
                </form>
            </Card>
        </>
    );
}

export default ProductFormClient;
