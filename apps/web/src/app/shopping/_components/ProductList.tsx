import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import Image from 'next/image';
import {Query} from '@/types/generated/graphql';
import {memo} from 'react';
import Link from 'next/link';

interface ProductListProps {
    title: string
    products: Query['products'];
    size?: number;
    aboveTheFold?: number;
}

const ProductList = memo(({title, products, size = 3, aboveTheFold = 3}: ProductListProps) => {

    return (
        <section className="container mx-auto px-4 py-8">
            {title ? <h2 className="text-2xl font-bold mb-4">{title}</h2> : null}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.slice(0, size).map(({id, name, brand, category, images, variants}, index) => {
                    const imageUrl = images?.[0]?.url || '/placeholder.jpg';
                    const price = variants?.[0]?.prices?.[0]?.price ?? 'N/A';
                    const priorityOrLazy = {
                        priority: index < aboveTheFold,
                        loading: index >= aboveTheFold ? 'lazy' : undefined as 'lazy' | 'eager' | undefined
                    }
                    return (
                        <Card key={id} className="overflow-hidden">
                            <Link href={`/shopping/products/${id}`}>
                                <Image
                                    src={imageUrl}
                                    width={640}
                                    height={640}
                                    {...priorityOrLazy}
                                    alt={name}
                                    className="w-full object-cover"
                                />
                            </Link>
                            <CardHeader>
                                <CardTitle className="line-clamp-3">{name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">{brand?.name ?? 'Unknown Brand'}</p>
                                <p className="text-lg font-semibold mt-2">${price}</p>
                                <p>{category?.name}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
});

ProductList.displayName = 'ProductList'

export default ProductList;
