"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createTransfer } from "@/lib/actions/dwolla.actions";
import { createTransaction } from "@/lib/actions/transaction.actions";
import { getBank, getBankByAccountId } from "@/lib/actions/user.actions";
import { decryptId } from "@/lib/utils";
import { BankDropdown } from "./BankDropdown";
import { Button } from "./ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useLoading } from "./LoadingOverlay";
import { toast } from "sonner";
import { transferFormSchema } from "@/lib/template";


const formSchema = transferFormSchema();

const PaymentTransferForm = ({ accounts }: PaymentTransferFormProps) => {
    const router = useRouter();
    const { setIsLoading } = useLoading();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            amount: "",
            senderBank: "",
            sharableId: "",
        },
    });

    const getTransferParams = async (sharableId: string, senderBankId: string) => {
        const receiverAccountId = decryptId(sharableId);
        const receiverBank = await getBankByAccountId({ accountId: receiverAccountId });
        const senderBank = await getBank({ documentId: senderBankId });
        return { receiverBank, senderBank };
    };

    const requestTransfer = async (senderBank: BankResponse, receiverBank: BankResponse, amount: string) => {
        const transferParams = {
            sourceFundingSourceUrl: senderBank.fundingSourceUrl,
            destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
            amount,
        };
        return await createTransfer(transferParams);
    };

    const requestTransaction = async (data: z.infer<typeof formSchema>, senderBank: BankResponse, receiverBank: BankResponse) => {
        const transaction = {
            name: data.name,
            amount: data.amount,
            senderId: senderBank.userId.$id,
            senderBankId: senderBank.$id,
            receiverId: receiverBank.userId.$id,
            receiverBankId: receiverBank.$id,
            email: data.email,
        };
        return await createTransaction(transaction);
    };

    const handleFormReset = () => {
        form.reset();
        router.push("/");
    };

    const handleTransaction = async ({transfer, data, senderBank, receiverBank}: handleTransactionParams) => {
        if (transfer) {
            const newTransaction = await requestTransaction(data, senderBank, receiverBank);
            if (newTransaction.fail) toast.error(newTransaction.message)
              else {
                toast.success("Transaction successfully completed");
                handleFormReset();
            }
        }
    }

    const submit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            const { receiverBank, senderBank } = await getTransferParams(data.sharableId, data.senderBank);
            const transfer = await requestTransfer(senderBank, receiverBank, data.amount);
            handleTransaction({transfer, data, senderBank, receiverBank});
        } catch (error) {
            toast.error("Unexpected error occurred. Please try again later.");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">
                <FormField
                    control={form.control}
                    name="senderBank"
                    render={() => (
                        <FormItem className="border-t border-gray-200">
                            <div className="payment-transfer_form-item pb-6 pt-5">
                                <div className="payment-transfer_form-content">
                                    <FormLabel className="text-14 font-medium text-gray-700">
                                        Select source bank
                                    </FormLabel>
                                    <FormDescription className="text-12 font-normal text-gray-600">
                                        Select the bank account you want to transfer funds from
                                    </FormDescription>
                                </div>
                                <div className="flex w-full flex-col gap-y-2">
                                    <FormControl>
                                        <BankDropdown accounts={accounts} setValue={form.setValue} otherStyles="!w-full" />
                                    </FormControl>
                                    <FormMessage className="form-message" />
                                </div>
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="border-t border-gray-200">
                            <div className="payment-transfer_form-item pb-6 pt-5">
                                <div className="payment-transfer_form-content">
                                    <FormLabel className="text-14 font-medium text-gray-700">
                                        Transfer note (Optional)
                                    </FormLabel>
                                    <FormDescription className="text-12 font-normal text-gray-600">
                                        Please provide any additional information or instructions related to the transfer
                                    </FormDescription>
                                </div>
                                <div className="flex w-full flex-col gap-y-2">
                                    <FormControl>
                                        <Textarea placeholder="Write a short note here" className="input-class" {...field} />
                                    </FormControl>
                                    <FormMessage className="form-message" />
                                </div>
                            </div>
                        </FormItem>
                    )}
                />

                <div className="payment-transfer_form-details">
                    <h2 className="text-18 font-semibold text-gray-900 dark:text-gray-300">Bank account details</h2>
                    <p className="text-16 font-normal text-gray-600">Enter the bank account details of the recipient</p>
                </div>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="border-t border-gray-200">
                            <div className="payment-transfer_form-item py-5">
                                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">Recipient&apos;s email address</FormLabel>
                                <div className="flex w-full flex-col gap-y-2">
                                    <FormControl>
                                        <Input placeholder="ex: johndoe@gmail.com" className="input-class" {...field} />
                                    </FormControl>
                                    <FormMessage className="form-message" />
                                </div>
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="sharableId"
                    render={({ field }) => (
                        <FormItem className="border-t border-gray-200">
                            <div className="payment-transfer_form-item pb-5 pt-6">
                                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">Receiver&apos;s Plaid sharable ID</FormLabel>
                                <div className="flex w-full flex-col gap-y-2">
                                    <FormControl>
                                        <Input placeholder="Enter the public account number" className="input-class" {...field} />
                                    </FormControl>
                                    <FormMessage className="form-message" />
                                </div>
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem className="border-y border-gray-200">
                            <div className="payment-transfer_form-item py-5">
                                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">Amount</FormLabel>
                                <div className="flex w-full flex-col gap-y-2">
                                    <FormControl>
                                        <div className="relative">
                                            <Input placeholder="ex: 5" className="input-class pr-8" {...field} />
                                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700">€</span>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="form-message" />
                                </div>
                            </div>
                        </FormItem>
                    )}
                />

                <div className="payment-transfer_btn-box">
                    <Button type="submit" className="payment-transfer_btn">
                        Transfer funds
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default PaymentTransferForm;
