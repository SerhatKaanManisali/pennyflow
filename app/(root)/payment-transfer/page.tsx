import HeaderBox from '@/components/HeaderBox'
import LoadingOverlayManager from '@/components/LoadingOverlayManager';
import PaymentTransferForm from '@/components/PaymentTransferForm';
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import React from 'react'

const PaymentTransfer = async () => {
    const loggedIn = await getLoggedInUser();
    if (!loggedIn) return;
    const accounts = await getAccounts({ userId: loggedIn.$id });
    if (!accounts) return;
    const accountsData = accounts?.data;

    return (
        <section className='payment-transfer'>
            <LoadingOverlayManager />
            <HeaderBox title='Payment transfer' subtext='Please provide any specific details or notes related to the payment transfer.'/>
            <section className='size-full pt-5'>
                <PaymentTransferForm accounts={accountsData}/>
            </section>
        </section>
    )
}

export default PaymentTransfer