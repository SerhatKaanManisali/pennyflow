import AuthForm from "@/components/AuthForm";
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const SignIn = () => {
    return (
        <section className="flex-center flex-col size-full max-sm:px-6">
            <AuthForm type="sign-in" />
            <Alert variant="default" className="w-fit h-fit mx-6 border-gray-300 text-gray-900 placeholder:text-gray-700 dark:text-gray-300 mb-6 shadow">
                <AlertTitle>Note</AlertTitle>
                <AlertDescription className="text-pretty text-center">
                    Use <span className="font-medium">test@mail.com</span> and <span className="font-medium">Test1234</span> as your credentials for a quick log in. However you may only use the given bank accounts.
                </AlertDescription>
            </Alert>
        </section>
    );
};

export default SignIn;