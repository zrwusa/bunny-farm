'use client';

import {Query} from '@/types/generated/graphql';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from '@/components/ui/carousel';
import {Badge} from '@/components/ui/badge';
import {Separator} from '@/components/ui/separator';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Button} from '@/components/ui/button';
import React, {FC} from 'react';
import {RichTextEditor} from '@/components/features/shopping/shop/rich-text-editor';
import {FlyingItemAnimation} from '@/components/features/animations/flyingItem-animation';
import {useAddToCartWithFlyAnimation} from '@/hooks/shopping/cart/useAddToCartWithFlyAnimation';
import Image from 'next/image';

export interface ProductProps {
    product: Query['product'];
}

export const Product: FC<ProductProps> = ({product}) => {
    const {flyingItem, handleAddToCart} = useAddToCartWithFlyAnimation(product?.images[0]?.url);
    if (!product) return <p className="text-center text-gray-500">Product not found</p>;
    const {images, skus, name, brand, category, description} = product;

    return (
        <div className="mx-auto p-6">
            <FlyingItemAnimation flyingItem={flyingItem}/>

            <Carousel className="mb-6">
                <CarouselContent>
                    {images.length > 0 ? (
                        images.map((image) => (
                            <CarouselItem key={image.id}>
                                <Card>
                                    <CardContent
                                        className="flex aspect-square items-center justify-center p-4 relative w-full h-96 bg-white">
                                        {/*<img src={image.url} alt={`Image ${image.id}`}*/}
                                        {/*     className="w-full h-full object-cover rounded-lg"/>*/}
                                        {/*<div className="relative w-full h-52 bg-white">*/}
                                        <Image
                                            src={image.url}
                                            alt={`Image ${image.id}`}
                                            fill
                                            className="object-contain p-2"
                                        />
                                        {/*</div>*/}
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))
                    ) : (
                        <CarouselItem>
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                        <span className="text-4xl font-semibold">No Image</span>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    )}
                </CarouselContent>
                <CarouselPrevious className="
        absolute top-1/2 left-4
        -translate-y-1/2
        z-10
        bg-white/70 backdrop-blur-md
        rounded-full p-2
        hover:bg-white
      "/>
                <CarouselNext className="
        absolute top-1/2 right-4
        -translate-y-1/2
        z-10
        bg-white/70 backdrop-blur-md
        rounded-full p-2
        hover:bg-white
      "/>
            </Carousel>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">{name}</CardTitle>
                    <p className="text-sm text-gray-500">
                        <span className="font-medium">Brand:</span> {brand?.name} |
                        <span className="font-medium ml-2">Category:</span> {category?.name}
                    </p>
                </CardHeader>
            </Card>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Product Skus</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Color</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Warehouse</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Options</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {skus.map((sku) =>
                                sku.prices.map((price, index) =>
                                    <TableRow key={`${sku.id}-${index}`}>
                                        <TableCell>
                                            <Badge variant="outline">{sku.color}</Badge>
                                        </TableCell>
                                        <TableCell>{sku.size}</TableCell>
                                        <TableCell>${price.price.toFixed(2)}</TableCell>
                                        <TableCell>
                                            {sku.inventories && sku.inventories.length > 0
                                                ? sku.inventories[0].warehouse?.name ?? 'N/A'
                                                : 'N/A'
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {sku.inventories && sku.inventories.length > 0
                                                ? sku.inventories[0].quantity ?? 0
                                                : 0
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                data-testid="add-to-cart"
                                                onClick={(event) => handleAddToCart(event, sku, price, index, product.id)}
                                                size="sm">
                                                Add to Cart
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Separator className="my-6"/>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Product Description</CardTitle>
                </CardHeader>
                <CardContent>
                    {description ? (
                        <RichTextEditor content={description} editable={false}/>
                    ) : (
                        <p className="text-gray-500">No description available</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
