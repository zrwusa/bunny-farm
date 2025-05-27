import Link from 'next/link';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import Image from 'next/image';
import {Query} from '@/types/generated/graphql';
import {searchProducts} from '@/lib/api/actions';


type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProductsPage({ searchParams }: PageProps) {
    const { q } = await searchParams;
    const query = typeof q === 'string' ? q : '';
    const products: Query['products'] = await searchProducts(query);

    const size = 100;
    const aboveTheFold = 3;

    return (
        <section className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.slice(0, size).map(({ id, name, brand, images, skus }, index) => {
                    const imageUrl = images?.[0]?.url || '/placeholder.jpg';
                    const price = skus?.[0]?.prices?.[0]?.price ?? 'N/A';

                    return (
                        <Card className="overflow-hidden" data-testid="product-card" key={id}>
                            <Link href={`/shopping/products/${id}`}>
                                <div className="relative w-full h-52 bg-white">
                                    <Image
                                        src={imageUrl}
                                        alt={name}
                                        fill
                                        className="object-contain p-2"
                                        priority={index < aboveTheFold}
                                        loading={index >= aboveTheFold ? 'lazy' : 'eager'}
                                    />
                                </div>
                            </Link>
                            <CardHeader>
                                <CardTitle className="line-clamp-2">{name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">{brand?.name ?? 'No Brand'}</p>
                                <p className="text-lg font-semibold">${price}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
}

