import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

const TransactionsTableSkeleton = () => {
    const rows = Array.from({ length: 5 });

    return (
        <Table>
            <TableHeader className='bg-[#f9fafb]'>
                <TableRow>
                    <TableHead className="px-2">Transaction</TableHead>
                    <TableHead className="px-2">Amount</TableHead>
                    <TableHead className="px-2">Status</TableHead>
                    <TableHead className="px-2">Date</TableHead>
                    <TableHead className="px-2 max-md:hidden">Channel</TableHead>
                    <TableHead className="px-2 max-lg:hidden">Category</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.map((_, index) => (
                    <TableRow key={index} className="bg-[#f9fafb] animate-pulse">
                        <TableCell className='max-w-[250px] pl-2 pr-10'>
                            <div className='flex items-center gap-3'>
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            </div>
                        </TableCell>
                        <TableCell className="pl-2 pr-10">
                            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                        </TableCell>
                        <TableCell className='pl-2 pr-10'>
                            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        </TableCell>
                        <TableCell className='pl-2 pr-10 min-w-32'>
                            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                        </TableCell>
                        <TableCell className='pl-2 pr-10 max-md:hidden min-w-24 capitalize'>
                            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        </TableCell>
                        <TableCell className='pl-2 pr-10 max-lg:hidden'>
                            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default TransactionsTableSkeleton