'use client';

import {Query} from '@/types/generated/graphql';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from '@/components/ui/carousel';
import {Badge} from '@/components/ui/badge';
import {Separator} from '@/components/ui/separator';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Button} from '@/components/ui/button';
import React, {FC} from 'react';
import {RichTextEditor} from '@/app/shopping/_components/RichTextEditor';
import {FlyingItemAnimation} from '@/app/shopping/_components/FlyingItemAnimation';
import {useAddToCartWithFlyAnimation} from '@/app/shopping/_hooks/useAddToCartWithFlyAnimation';

export interface ProductDetailProps {
    product: Query['product'];
}

export const ProductDetail: FC<ProductDetailProps> = ({product}) => {
    const {flyingItem, handleAddToCart} = useAddToCartWithFlyAnimation(product?.images[0]?.url);
    if (!product) return <p className="text-center text-gray-500">Product not found</p>;
    const {images, variants, name, brand, category, description} = product;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <FlyingItemAnimation flyingItem={flyingItem}/>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">{name}</CardTitle>
                    <p className="text-sm text-gray-500">
                        <span className="font-medium">Brand:</span> {brand?.name} |
                        <span className="font-medium ml-2">Category:</span> {category?.name}
                    </p>
                </CardHeader>
            </Card>

            <Carousel className="w-full max-w-xl mx-auto mb-6">
                <CarouselContent>
                    {images.length > 0 ? (
                        images.map((image) => (
                            <CarouselItem key={image.id}>
                                <div className="p-1">
                                    <Card>
                                        <CardContent className="flex aspect-square items-center justify-center p-4">
                                            <img src={image.url} alt={`Image ${image.id}`}
                                                 className="w-full h-full object-cover rounded-lg"/>
                                        </CardContent>
                                    </Card>
                                </div>
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
                <CarouselPrevious/>
                <CarouselNext/>
            </Carousel>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Product Description</CardTitle>
                </CardHeader>
                <CardContent>
                    {description ? (
                        <RichTextEditor content={description} editable={true}/>
                    ) : (
                        <p className="text-gray-500">No description available</p>
                    )}
                </CardContent>
            </Card>

            <Separator className="my-6"/>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Product Variants</CardTitle>
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
                            {variants.map((variant) =>
                                variant.prices.map((price, index) =>
                                    <TableRow key={`${variant.id}-${index}`}>
                                        <TableCell>
                                            <Badge variant="outline">{variant.color}</Badge>
                                        </TableCell>
                                        <TableCell>{variant.size}</TableCell>
                                        <TableCell>${price.price.toFixed(2)}</TableCell>
                                        <TableCell>
                                            {variant.inventories && variant.inventories.length > 0
                                                ? variant.inventories[0].warehouse?.name ?? 'N/A'
                                                : 'N/A'
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {variant.inventories && variant.inventories.length > 0
                                                ? variant.inventories[0].quantity ?? 0
                                                : 0
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={(event) => handleAddToCart(event, variant, price, index)}
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
        </div>
    );
};
