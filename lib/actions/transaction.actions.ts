'use server';

import { Databases, ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";

const {
    APPWRITE_DATABASE_ID: DATABASE_ID,
    APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTION_COLLECTION_ID
} = process.env;

export const createTransaction = async (transaction: CreateTransactionProps) => {
    try {
        const {database} = await createAdminClient();
        const newTransaction = await database.createDocument(
            DATABASE_ID!,
            TRANSACTION_COLLECTION_ID!,
            ID.unique(),
            {
                channel: 'online',
                category: 'Transfer',
                ...transaction
            }
        )
        return parseStringify(newTransaction);
    } catch (error) {
        return {fail: true, message: 'Creating transfer failed!'}
    }
}

export const queryTransactions = async (database: Databases, bankId: string, type: string) => {
    const transactions = await database.listDocuments(
        DATABASE_ID!,
        TRANSACTION_COLLECTION_ID!,
        [Query.equal(`${type}BankId`, bankId)]
    )
    return transactions;
}

export const getTransactionsByBankId = async ({bankId}: getTransactionsByBankIdProps) => {
    try {
        const {database} = await createAdminClient();
        const senderTransactions = await queryTransactions(database, bankId, 'sender');
        const receiverTransactions = await queryTransactions(database, bankId, 'receiver');
        const transactions = {
            total: senderTransactions.total + receiverTransactions.total,
            documents: [...senderTransactions.documents, ...receiverTransactions.documents]
        }
        return parseStringify(transactions);
    } catch (error) {
        console.log(error);
    }
}