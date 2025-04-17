'use client'

// import {
//     flexRender,
//     getCoreRowModel,
//     getFilteredRowModel,
//     getPaginationRowModel,
//     getSortedRowModel,
//     useReactTable
// } from '@tanstack/react-table'
// import {ArrowUpDown, ChevronDown, MoreHorizontal} from 'lucide-react'
//
// import {Button} from '@/components/ui/button'
// import {Checkbox} from '@/components/ui/checkbox'
// import {
//     DropdownMenu,
//     DropdownMenuCheckboxItem,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
// import {Input} from '@/components/ui/input'
// import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table'
// import {useState} from 'react';
import {Product} from '@/types/generated/graphql';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {Button} from '@/components/ui/button'
import {useRouter} from 'next/navigation'

interface ProductsTableProps {
    products: Product[]
}

export function ProductsTable({products}: ProductsTableProps) {
    const router = useRouter()

    const formatDescription = (description: any) => {
        if (!description) return '-'
        if (typeof description === 'string') return description
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
