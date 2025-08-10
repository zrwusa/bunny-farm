// app/checkout/page.tsx
import {getMyAddresses, getSelectedCartItems} from '@/lib/api/server-actions';
import Checkout from '@/components/shopping/checkout/checkout';
import Image from 'next/image';

export default async function CheckoutPage() {
    const items = await getSelectedCartItems();
    const addresses = await getMyAddresses();

    return (
        <div className="mx-auto max-w-4xl p-6">
            <h1 className="mb-8 text-3xl font-bold">Items</h1>
            <ul className="mb-8">
                {items && items.map(({skuId, quantity, product}) => (
                    <li key={skuId} className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4">
                            <Image
                                src={product?.images[0]?.url || '/avatar.svg'}
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

            {
                addresses && items && <Checkout addresses={addresses} items={items}/>
            }
        </div>
    );
}
