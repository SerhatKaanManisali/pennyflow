import { LoadingProvider } from '@/components/LoadingOverlayContext';
import TransactionHistoryClient from '@/components/TransactionHistoryClient';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import React from 'react'

const TransactionHistory = async ({ searchParams: { id, page } }: SearchParamProps) => {
    const currentPage = Number(page as string) || 1;

    const loggedIn = await getLoggedInUser();
    if (!loggedIn) return;
    const accounts = await getAccounts({ userId: loggedIn.$id });
    if (!accounts) return;

    const accountsData = accounts?.data;
    const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;
    const account = await getAccount({ appwriteItemId });

    const rowsPerPage = 10;
    const totalPages = Math.ceil(account?.transactions.length / rowsPerPage);
    const indexOfLastTransaction = currentPage * rowsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
    const currentTransactions = account?.transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
    
    return (
        <LoadingProvider>
            <TransactionHistoryClient
                account={account}
                currentTransactions={currentTransactions}
                totalPages={totalPages}
                currentPage={currentPage}
            />
        </LoadingProvider>
    )
}

export default TransactionHistory