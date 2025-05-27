'use client'

import {Product} from '@/types/generated/graphql';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {Button} from '@/components/ui/button'
import {useRouter} from 'next/navigation'

interface ProductsTableProps {
    products: Product[]
}

export function ProductsTable({products}: ProductsTableProps) {
    const router = useRouter()

    const formatDescription = (description?: Record<string, unknown> | null) => {
       if (!description) return '';
        return Object.entries(description)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ')
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Brand</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{formatDescription(product.description)}</TableCell>
                            <TableCell>{product.brand?.name || '-'}</TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push(`/cms/products/${product.id}`)}
                                >
                                    Edit
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default ProductsTable;
