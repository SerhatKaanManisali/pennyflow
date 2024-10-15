"use server";

import {
    AccountsGetResponse,
    ACHClass,
    CountryCode,
    TransferAuthorizationCreateRequest,
    TransferCreateRequest,
    TransferNetwork,
    TransferType,
} from "plaid";
import { plaidClient } from "../plaid";
import { parseStringify } from "../utils";
import { getBanks, getBank } from "./user.actions";
import { getTransactionsByBankId } from "./transaction.actions";
import { AxiosResponse } from "axios";
import { accountDataTemplate, transactionDataTemplate, transferAuthRequestTemplate, transferCreateRequestTemplate, transferDataTemplate } from "../template";

export const getPlaidAccountInfo = async (bank: Bank) => {
    const accountsResponse = await plaidClient.accountsGet({
        access_token: bank.accessToken
    });
    const accountData = accountsResponse.data.accounts[0];
    return { accountsResponse, accountData };
}

export const getPlaidInstitution = async (accountsResponse: AxiosResponse<AccountsGetResponse, any>) => {
    const institution = await getInstitution({
        institutionId: accountsResponse.data.item.institution_id!,
    });
    return institution;
}

export const getTransferTransactions = async (bank: Bank) => {
    const transferTransactionsData = await getTransactionsByBankId({
        bankId: bank.$id,
    });
    const transferTransactions = transferTransactionsData.documents.map(
        (transferData: Transaction) => (transferDataTemplate(transferData, bank))
    );
    return transferTransactions;
}

export const getAccounts = async ({ userId }: getAccountsProps) => {
    try {
        const banks = await getBanks({ userId });
        const accounts = await Promise.all(
            banks?.map(async (bank: Bank) => {
                const { accountsResponse, accountData } = await getPlaidAccountInfo(bank);
                const institution = await getPlaidInstitution(accountsResponse);
                const account = accountDataTemplate(accountData, institution, bank);
                return account;
            })
        );
        
        const totalBanks = accounts.length;
        const totalCurrentBalance = accounts.reduce((total, account) => {
            return total + account.currentBalance;
        }, 0);
        return parseStringify({ data: accounts, totalBanks, totalCurrentBalance });
    } catch (error) {
        console.error("An error occurred while getting the accounts:", error);
    }
};

export const getAccount = async ({ appwriteItemId }: getAccountProps) => {
    try {
        const bank = await getBank({ documentId: appwriteItemId });
        const { accountsResponse, accountData } = await getPlaidAccountInfo(bank);
        const transferTransactions = await getTransferTransactions(bank);
        const institution = await getPlaidInstitution(accountsResponse);
        const transactions = await getTransactions({
            accessToken: bank?.accessToken,
        });
        const account = accountDataTemplate(accountData, institution, bank);
        const allTransactions = [...transactions, ...transferTransactions].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        return parseStringify({
            data: account,
            transactions: allTransactions,
        });
    } catch (error) {
        console.error("An error occurred while getting the account:", error);
    }
};

export const getInstitution = async ({ institutionId }: getInstitutionProps) => {
    try {
        const institutionResponse = await plaidClient.institutionsGetById({
            institution_id: institutionId,
            country_codes: ["US"] as CountryCode[],
        });
        const institution = institutionResponse.data.institution;
        return parseStringify(institution);
    } catch (error) {
        console.error("An error occurred while getting the institution:", error);
    }
};

export const getTransactions = async ({ accessToken }: getTransactionsProps) => {
    let hasMore = true;
    let transactions: any = [];
    try {
        while (hasMore) {
            const response = await plaidClient.transactionsSync({
                access_token: accessToken,
            });
            const data = response.data;
            transactions = response.data.added.map((transaction) => (transactionDataTemplate(transaction)));
            hasMore = data.has_more;
        }
        return parseStringify(transactions);
    } catch (error) {
        console.error("An error occurred while getting the transactions:", error);
    }
};

export const createTransfer = async () => {
    const transferAuthRequest: TransferAuthorizationCreateRequest = transferAuthRequestTemplate();
    try {
        const transferAuthResponse = await plaidClient.transferAuthorizationCreate(transferAuthRequest);
        const authorizationId = transferAuthResponse.data.authorization.id;
        const transferCreateRequest: TransferCreateRequest = transferCreateRequestTemplate(authorizationId);
        const responseCreateResponse = await plaidClient.transferCreate(transferCreateRequest);
        const transfer = responseCreateResponse.data.transfer;
        return parseStringify(transfer);
    } catch (error) {
        console.error("An error occurred while creating the transfer:", error);
    }
};