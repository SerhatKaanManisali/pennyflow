import AuthForm from "@/components/AuthForm";
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SignUp = async () => {
    return (
        <section className="flex-center flex-col size-full max-sm:px-6">
            <AuthForm type="sign-up" />
            <Alert variant="default" className="w-fit h-fit mx-6 border-gray-300 text-gray-900 placeholder:text-gray-700 dark:text-gray-300 mb-6 shadow">
                <AlertTitle>Note</AlertTitle>
                <AlertDescription className="text-pretty text-center">
                    Please use a US state such as CA.
                    When connecting a bank account, pick one of <span className="font-medium">Chase Bank</span> or <span className="font-medium">Citi Bank</span> as the current version is a demo.
                </AlertDescription>
            </Alert>
        </section>
    );
};

export default SignUp;