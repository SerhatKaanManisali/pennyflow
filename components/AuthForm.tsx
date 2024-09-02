"use client"

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomInput from './CustomInput'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/actions/user.actions'
import PlaidLink from './PlaidLink'
import { useLoading } from './LoadingOverlay'
import { toast } from 'sonner'

import SignUpForm from './SignUpForm'
import { authFormSchema, userDataTemplate } from '@/lib/template'

const AuthForm = ({ type }: { type: string }) => {
    const router = useRouter();
    const [user, setuser] = useState(null);
    const { setIsLoading } = useLoading();
    const formSchema = authFormSchema(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            await trySubmit(data);
        } catch (error: any) {
            const errorMessage = error?.response?.message || "Unexpected error occurred. Please try again later.";
            toast.error(errorMessage);
            setIsLoading(false);
        }
    }

    const trySubmit = async (data: z.infer<typeof formSchema>) => {
        switch (type) {
            case 'sign-up':
                const userData = userDataTemplate(data, formatDateOfBirth(data));
                const newUser = await signUp(userData);
                handleResponse(newUser);
                break;
            case 'sign-in':
                const response = await signIn({
                    email: data.email,
                    password: data.password
                });
                handleResponse(response);
                break;
        }
    }

    const formatDateOfBirth = (data: z.infer<typeof formSchema>) => {
        const [day, month, year] = data.dateOfBirth!.split('-');
        return `${year}-${month}-${day}`;
    }

    const handleResponse = (response: any) => {
        if (response.fail) {
            setIsLoading(false);
            toast.error(response.message);
        } else {
            if (type === 'sign-up') setuser(response);
            else if (type === 'sign-in') router.push('/');
        }
    }

    return (
        <section className="auth-form">
            <header className="flex flex-col gap-5 md:gap-8">
                <Link href="/" className="pointer-events-none flex items-center gap-1">
                    <Image
                        src="./icons/logo.svg"
                        width={34}
                        height={34}
                        alt="Pennyflow logo"
                    />
                    <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1 dark:text-white">
                        Pennyflow
                    </h1>
                </Link>
                
                <div className="flex flex-col gap-1 md:gap-3">
                    <h1 className="text-24 lg:text-36 font-semibold text-gray-900 dark:text-white">
                        {user ? "Link Account" : type === "sign-in" ? "Sign in" : "Sign up"}
                        <p className="text-16 font-normal text-gray-700">
                            {user ? "Link your account to get started" : "Please enter your details"}
                        </p>
                    </h1>
                </div>
            </header>

            {user ? (
                <div className="flex flex-col gap-4">
                    <PlaidLink user={user} variant="primary" />
                </div>
            ) : (
                <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4">
                            {type === "sign-up" && (
                                <SignUpForm form={form}/>
                            )}

                            <CustomInput control={form.control} name={"email"} label={"Email"} placeholder={"Enter your email"} />
                            <CustomInput control={form.control} name={"password"} label={"Password"} placeholder={"Enter your password"} />
                            
                            <div className="flex flex-col gap-4">
                                <Button type="submit" className="form-btn">
                                    {type === "sign-in" ? "Sign in" : "Sign up"}
                                </Button>
                            </div>
                        </form>
                    </Form>

                    <footer className="flex justify-center gap-1">
                        <p className="text-14 font-normal text-gray-600">
                            {type === "sign-in" ? "Don't have an account?" : "Already have an account?"}
                        </p>
                        
                        <Link
                            href={type === "sign-in" ? "/sign-up" : "/sign-in"} className="form-link" onClick={() => setIsLoading(true)}>
                            {type === "sign-in" ? "Sign up" : "Sign in"}
                        </Link>
                    </footer>
                </>
            )}
        </section>
    );
}
export default AuthForm