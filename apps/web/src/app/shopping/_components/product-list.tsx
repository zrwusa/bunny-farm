import {Query} from '@/types/generated/graphql';
import {searchProducts} from '@/lib/api/actions';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';


export const ProductList = async ({searchParams = {}}: { searchParams?: { q?: string } }) => {
    const query = searchParams?.q ?? '';

    let products: Query['products'] = [];

    products = await searchProducts(query);
    const size = 100;
    const aboveTheFold = 3;
    const title = query ? `Search results for "${query}"` : 'All Products';

    return (
        <section className="container mx-auto px-4 py-8">
            {title ? <h2 className="text-2xl font-bold mb-4">{title}</h2> : null}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.slice(0, size).map(({id, name, brand, category, images, skus}, index) => {
                    const imageUrl = images?.[0]?.url || '/placeholder.jpg';
                    const price = skus?.[0]?.prices?.[0]?.price ?? 'N/A';
                    const priorityOrLazy = {
                        priority: index < aboveTheFold,
                        loading: index >= aboveTheFold ? 'lazy' : undefined as 'lazy' | 'eager' | undefined
                    }
                    return (
                        <Link href={`/shopping/products/${id}`} key={id}>
                            <Card className="overflow-hidden" data-testid="product-card">
                                <Image
                                    src={imageUrl}
                                    width={640}
                                    height={640}
                                    {...priorityOrLazy}
                                    alt={name}
                                    className="w-full object-cover"
                                />
                                <CardHeader>
                                    <CardTitle className="line-clamp-3">{name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">{brand?.name ?? 'Unknown Brand'}</p>
                                    <p className="text-lg font-semibold mt-2">${price}</p>
                                    <p>{category?.name}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default ProductList;