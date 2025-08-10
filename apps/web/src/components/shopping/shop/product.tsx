'use client';

import {ProductPrice, Query, Sku} from '@/types/generated/graphql';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from '@/components/ui/carousel';
import {Badge} from '@/components/ui/badge';
import {Separator} from '@/components/ui/separator';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Button} from '@/components/ui/button';
import React, {FC} from 'react';
import {RichTextEditor} from '@/components/shopping/shop/rich-text-editor';
import {FlyingItemAnimation} from '@/components/common/animations/flyingItem-animation';
import {useAddToCartWithFlyAnimation} from '@/hooks/shopping/cart/use-add-to-cart-with-fly-animation';
import Image from 'next/image';

export interface ProductProps {
    product: Query['product'];
}

interface AddToCartButtonProps {
    sku: Sku;
    price:  ProductPrice;
    index: number;
    productId: string;
    onAdd: (event: React.MouseEvent, sku: Sku, price: ProductPrice, index: number, productId: string) => void;
    fullWidth?: boolean;
}

const AddToCartButton: FC<AddToCartButtonProps> = ({
                                                       sku,
                                                       price,
                                                       index,
                                                       productId,
                                                       onAdd,
                                                       fullWidth = false
                                                   }) => {
    const quantity = sku.inventories?.[0]?.quantity ?? 0;
    const isOutOfStock = quantity <= 0;

    return (
        <Button
            data-testid="add-to-cart"
            disabled={isOutOfStock}
            onClick={(event) => onAdd(event, sku, price, index, productId)}
            size="sm"
            className={fullWidth ? 'w-full mt-2' : ''}
        >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
    );
};


export const Product: FC<ProductProps> = ({product}) => {
    const {flyingItem, handleAddToCart} = useAddToCartWithFlyAnimation(product?.images[0]?.url);
    if (!product) return <p className="text-center text-gray-500">Product not found</p>;
    const {images, skus, name, brand, category, description} = product;

    return (
        <>
            <FlyingItemAnimation flyingItem={flyingItem}/>

            <div className="flex flex-col lg:flex-row gap-6 mb-6">
                <div className="w-full lg:w-1/2">
                    <Carousel className="w-full">
                        <CarouselContent>
                            {images.length > 0 ? (
                                images.map((image) => (
                                    <CarouselItem key={image.id}>
                                        <Card>
                                            <CardContent className="flex aspect-square items-center justify-center p-4 relative w-full h-96 bg-white">
                                                <Image
                                                    src={image.url}
                                                    alt={`Image ${image.id}`}
                                                    fill
                                                    className="object-contain p-2"
                                                />
                                            </CardContent>
                                        </Card>
                                    </CarouselItem>
                                ))
                            ) : (
                                <CarouselItem>
                                    <Card>
                                        <CardContent className="flex aspect-square items-center justify-center p-6">
                                            <span className="text-4xl font-semibold">No Image</span>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            )}
                        </CarouselContent>
                        <CarouselPrevious className="absolute top-1/2 left-4 -translate-y-1/2 z-10 bg-white/70 backdrop-blur-md rounded-full p-2 hover:bg-white" />
                        <CarouselNext className="absolute top-1/2 right-4 -translate-y-1/2 z-10 bg-white/70 backdrop-blur-md rounded-full p-2 hover:bg-white" />
                    </Carousel>
                </div>

                <div className="w-full lg:w-1/2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">{name}</CardTitle>
                            <p className="text-sm text-gray-500">
                                <span className="font-medium">Brand:</span> {brand?.name} |
                                <span className="font-medium ml-2">Category:</span> {category?.name}
                            </p>
                        </CardHeader>
                    </Card>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Product Skus</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="hidden lg:block">
                        <Table className="table-fixed w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[120px]">Color</TableHead>
                                    <TableHead className="w-[160px]">Size</TableHead>
                                    <TableHead className="w-[60px]">Price</TableHead>
                                    <TableHead className="w-[160px]">Warehouse</TableHead>
                                    <TableHead className="w-[40px]">Stock</TableHead>
                                    <TableHead className="w-[140px] text-center">Options</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {skus.map((sku) =>
                                    sku.prices.map((price, index) => (
                                        <TableRow key={`${sku.id}-${index}`}>
                                            <TableCell className="w-[120px]">
                                                <Badge variant="outline">{sku.color}</Badge>
                                            </TableCell>
                                            <TableCell className="w-[80px]">{sku.size}</TableCell>
                                            <TableCell className="w-[100px]">${price.price.toFixed(2)}</TableCell>
                                            <TableCell className="w-[160px]">
                                                {sku.inventories?.[0]?.warehouse?.name ?? 'N/A'}
                                            </TableCell>
                                            <TableCell className="w-[80px]">
                                                {sku.inventories?.[0]?.quantity ?? 0}
                                            </TableCell>
                                            <TableCell className="w-[140px] text-center">
                                                <AddToCartButton
                                                    sku={sku}
                                                    price={price}
                                                    index={index}
                                                    productId={product.id}
                                                    onAdd={handleAddToCart}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="lg:hidden space-y-4">
                        {skus.map((sku) =>
                            sku.prices.map((price, index) => (
                                <Card key={`${sku.id}-${index}`}>
                                    <CardContent className="p-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">Color:</span>
                                            <Badge variant="outline">{sku.color}</Badge>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">Size:</span>
                                            <span>{sku.size}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">Price:</span>
                                            <span>${price.price.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">Warehouse:</span>
                                            <span>{sku.inventories?.[0]?.warehouse?.name ?? 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">Stock:</span>
                                            <span>{sku.inventories?.[0]?.quantity ?? 0}</span>
                                        </div>
                                        <AddToCartButton
                                            sku={sku}
                                            price={price}
                                            index={index}
                                            productId={product.id}
                                            fullWidth={true}
                                            onAdd={handleAddToCart}
                                        />
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    <div className="lg:hidden space-y-4">
                        {skus.map((sku) =>
                            sku.prices.map((price, index) => (
                                <Card key={`${sku.id}-${index}`}>
                                    <CardContent className="p-4 space-y-2">
                                        <div className="flex justify-between">
                                            <span className="font-medium">Color:</span>
                                            <Badge variant="outline">{sku.color}</Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Size:</span>
                                            <span>{sku.size}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Price:</span>
                                            <span>${price.price.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Warehouse:</span>
                                            <span>{sku.inventories?.[0]?.warehouse?.name ?? 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Stock:</span>
                                            <span>{sku.inventories?.[0]?.quantity ?? 0}</span>
                                        </div>
                                        <Button
                                            className="w-full"
                                            size="sm"
                                            onClick={(event) =>
                                                handleAddToCart(event, sku, price, index, product.id)
                                            }>
                                            Add to Cart
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

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
        </>
    );
};
