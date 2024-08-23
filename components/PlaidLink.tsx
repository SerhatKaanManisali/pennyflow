import React, { useCallback, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from 'react-plaid-link'
import { useRouter } from 'next/navigation';
import { createLinkToken, exchangePublicToken } from '@/lib/actions/user.actions';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
    const router = useRouter();
    const [token, setToken] = useState("");

    useEffect(() => {
        const getLinkToken = async () => {
            const data = await createLinkToken(user);
            setToken(data?.linkToken);
        }
        getLinkToken();
    }, [user]);

    const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
        await exchangePublicToken({
            publicToken: public_token,
            user
        });

        router.push("/");
    }, [user]);

    const config: PlaidLinkOptions = {
        token,
        onSuccess
    }

    const { open, ready } = usePlaidLink(config);

    return (
        <>
            {variant === "primary" ? (
                <Button className="plaidlink-primary" onClick={() => open()} disabled={!ready}>
                    Connect bank
                </Button>
            ) : variant === "ghost" ? (
                <Button onClick={() => open()} className='plaidlink-ghost' variant='ghost'>
                    <Image src='/icons/connect-bank.svg' alt='connect bank' width={24} height={24} />
                    <p className='hidden text-[16px] font-semibold text-black-2 xl:block'>Connect bank</p>
                </Button>
            ) : variant === "mobile" ? (
                <Button onClick={() => open()} className={cn('mobilenav-sheet_close w-full', '!justify-start')}>
                    <Image src='/icons/connect-bank.svg' alt='connect bank' width={20} height={20} />
                    <p className={cn('!text-16 font-semibold text-black-2')}>Connect bank</p>
                </Button>
            ) : (
                <Button onClick={() => open()} className={cn("sidebar-link")}>
                    <Image src='/icons/connect-bank.svg' alt='connect bank' width={24} height={24} />
                    <p className={cn('sidebar-label')}>Connect bank</p>
                </Button>
            )}
        </>
    )
}

export default PlaidLink