'use client'

import React, { useEffect, useState } from 'react'
import HeaderBox from './HeaderBox'
import { formatAmount } from '@/lib/utils'
import TransactionsTableSkeleton from './TransactionsTableSkeleton'
import TransactionsTable from './TransactionsTable'
import { Pagination } from './Pagination'

const TransactionHistoryClient = ({
    account,
    currentTransactions,
    totalPages,
    currentPage
}: TransactionHistoryClientParams) => {
    
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => setIsLoading(false), [currentPage]);

    return (
        <div className='transactions'>
            <div className='transactions-header'>
                <HeaderBox title='Transaction history' subtext='See your bank details and transactions.' />
            </div>

            <div className='space-y-6'>
                <div className='transactions-account'>
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-18 font-bold text-white dark:text-gray-300'>
                            {account?.data.name}
                        </h2>

                        <p className='text-14 text-blue-25 dark:text-gray-300'>
                            {account?.data.officialName}
                        </p>

                        <p className="text-14 font-semibold tracking-[1.1px] text-white dark:text-gray-300">
                            &#9679;&#9679;&#9679;&#9679; &#9679;&#9679;&#9679;&#9679; &#9679;&#9679;&#9679;&#9679; {account?.data.mask}
                        </p>
                    </div>

                    <div className='transactions-account-balance'>
                        <p className='text-14'>Current balance</p>
                        <p className='text-24 text-center font-bold'>{formatAmount(account?.data.currentBalance)}</p>
                    </div>
                </div>

                <section className='flex w-full flex-col gap-6'>
                    {isLoading ? (
                        <TransactionsTableSkeleton />
                    ) : (
                        <TransactionsTable transactions={currentTransactions} />
                    )}

                    {totalPages > 1 && (
                        <div className='my-4 w-full'>
                            <Pagination
                                totalPages={totalPages}
                                page={currentPage}
                                setLoadingState={setIsLoading}
                            />
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}

export default TransactionHistoryClient