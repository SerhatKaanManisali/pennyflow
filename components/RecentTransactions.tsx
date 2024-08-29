'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BankTabItem } from './BankTabItem'
import BankInfo from './BankInfo'
import TransactionsTable from './TransactionsTable'
import { Pagination } from './Pagination'
import TransactionsTableSkeleton from './TransactionsTableSkeleton'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const RecentTransactions = ({ accounts, transactions = [], appwriteItemId, page = 1 }: RecentTransactionsProps) => {
    const rowsPerPage = 10;
    const totalPages = Math.ceil(transactions.length / rowsPerPage);
    const indexOfLastTransaction = page * rowsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
    const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const router = useRouter();
    useEffect(() => setIsLoading(false), [page, searchParams]);
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('page');
        const newUrl = `${pathName}?${params.toString()}`;
        router.replace(newUrl);
    }, [appwriteItemId]);

    return (
        <section className='recent-transactions'>
            <header className='flex items-center justify-between'>
                <h2 className='recent-transactions-label'>
                    Recent transactions
                </h2>
                <Link href={`/transaction-history/?id=${appwriteItemId}`} className='view-all-btn hover:text-white hover:bg-bank-gradient'>
                    View all
                </Link>
            </header>

            <Tabs defaultValue={appwriteItemId} className="w-full">
                <TabsList className='recent-transactions-tablist'>
                    {accounts.map((account: Account) => (
                        <TabsTrigger key={account.id} value={account.appwriteItemId} onClick={() => setIsLoading(true)}>
                            <BankTabItem key={account.id} account={account} appwriteItemId={appwriteItemId} />
                        </TabsTrigger>
                    ))}
                </TabsList>
                {accounts.map((account: Account) => (
                    <TabsContent key={account.id} value={account.appwriteItemId} className='space-y-4'>
                        <BankInfo account={account} appwriteItemId={appwriteItemId} type='full' />
                        {isLoading ? (
                            <TransactionsTableSkeleton />
                        ) : (
                            <TransactionsTable transactions={currentTransactions} />
                        )}
                        {totalPages > 1 && (
                            <div className='my-4 w-full'>
                                <Pagination totalPages={totalPages} page={page} setIsLaoading={setIsLoading} />
                            </div>
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </section>
    )
}

export default RecentTransactions