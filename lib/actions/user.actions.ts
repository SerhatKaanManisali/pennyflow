"use server"

import { Databases, ID, Models, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { AccountBase, CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { plaidClient } from "../plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";

const {
    APPWRITE_DATABASE_ID: DATABASE_ID,
    APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
    APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID
} = process.env;

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
    try {
        const { database } = await createAdminClient();
        const user = await database.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [Query.equal("userId", [userId])]);
        return parseStringify(user.documents[0]);
    } catch (error) {
        console.error(error);
    }
}

export const signIn = async ({ email, password }: signInProps) => {
    try {
        const { account } = await createAdminClient();
        const session = await account.createEmailPasswordSession(email, password);
        setCookies(session);
        const user = await getUserInfo({ userId: session.userId });
        return parseStringify(user);
    } catch (error) {
        console.error("Error:", error);

    }
}

export const signUp = async ({ password, ...userData }: SignUpParams) => {
    const { email, firstName, lastName } = userData;
    let newUserAccount;

    try {
        const { account, database } = await createAdminClient();
        newUserAccount = await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);
        if (!newUserAccount) throw new Error("Error creating user");
        const dwollaCustomerUrl = await createDwollaCustomer({
            ...userData,
            type: "personal"
        });
        if (!dwollaCustomerUrl) throw new Error("Error creating Dwolla customer");
        const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);
        const newUser = await createNewUser(database, { password, ...userData }, newUserAccount, dwollaCustomerId, dwollaCustomerUrl);
        const session = await account.createEmailPasswordSession(email, password);
        setCookies(session);
        return parseStringify(newUser);
    } catch (error) {
        console.error(error);
    }
}

async function createNewUser(database: Databases, { password, ...userData }: SignUpParams, newUserAccount: Models.User<Models.Preferences>, dwollaCustomerId: string, dwollaCustomerUrl: string) {
    return await database.createDocument(
        DATABASE_ID!,
        USER_COLLECTION_ID!,
        ID.unique(),
        {
            ...userData,
            userId: newUserAccount.$id,
            dwollaCustomerId,
            dwollaCustomerUrl
        }
    );
}

function setCookies(session: Models.Session) {
    cookies().set("appwrite-session", session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
    });
}

export async function getLoggedInUser() {
    try {
        const { account } = await createSessionClient();
        const result = await account.get();
        const user = await getUserInfo({ userId: result.$id });
        return parseStringify(user);
    } catch (error) {
        return null;
    }
}

export const logoutAccount = async () => {
    try {
        const { account } = await createSessionClient();
        cookies().delete("appwrite-session");
        await account.deleteSession("current");
    } catch (error) {
        return null;
    }
}

export const createLinkToken = async (user: User) => {
    try {
        const tokenParams = {
            user: {
                client_user_id: user.$id
            },
            client_name: `${user.firstName} ${user.lastName}`,
            products: ["auth"] as Products[],
            language: "en",
            country_codes: ["US"] as CountryCode[]
        }

        const response = await plaidClient.linkTokenCreate(tokenParams);

        return parseStringify({ linkToken: response.data.link_token })
    } catch (error) {
        console.log(error);
    }
}

export const createBankAccount = async ({ userId, bankId, accountId, shareableId }: createBankAccountProps) => {
    try {
        const { database } = await createAdminClient();
        const bankAccount = await database.createDocument(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            ID.unique(),
            { userId, bankId, accountId, shareableId }
        );
        return parseStringify(bankAccount);
    } catch (error) {

    }
}

export const exchangePublicToken = async ({
    publicToken,
    user
}: exchangePublicTokenProps) => {
    try {
        const { accessToken, itemId } = await publicTokenResponse(publicToken);
        const accountData = await getAccountInfo(accessToken);
        const processorToken = await createProcessorToken(accessToken, accountData);
        const fundingSourceUrl = await createFundingSourceUrl(user, accountData, processorToken);

        await createBankAccount({
            userId: user.$id,
            bankId: itemId,
            accountId: accountData.account_id, accessToken, fundingSourceUrl,
            shareableId: encryptId(accountData.account_id)
        });

        revalidatePath("/");
        return parseStringify({ publicTokenExchange: "complete" });
    } catch (error) {
        console.log("An error has occured while creating exchangin token:", error);
    }
}

async function publicTokenResponse(publicToken: string) {
    const response = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken
    });
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
    return { accessToken, itemId };
}

async function getAccountInfo(accessToken: string) {
    const accountsResponse = await plaidClient.accountsGet({
        access_token: accessToken
    });
    const accountData = accountsResponse.data.accounts[0];
    return accountData;
}

async function createProcessorToken(accessToken: string, accountData: AccountBase) {
    const request: ProcessorTokenCreateRequest = {
        access_token: accessToken,
        account_id: accountData.account_id,
        processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum
    };
    const processorTokenResponse = await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;
    return processorToken;
}

async function createFundingSourceUrl(user: User, accountData: AccountBase, processorToken: string) {
    const fundingSourceUrl = await addFundingSource({
        dwollaCustomerId: user.dwollaCustomerId, processorToken,
        bankName: accountData.name
    });
    if (!fundingSourceUrl) throw Error;
    return fundingSourceUrl;
}

export const getBanks = async ({ userId }: getBanksProps) => {
    try {
        const { database } = await createAdminClient();
        const banks = await database.listDocuments(DATABASE_ID!, BANK_COLLECTION_ID!, [Query.equal("userId", [userId])]);
        return parseStringify(banks.documents);
    } catch (error) {
        console.error(error);
    }
}
export const getBank = async ({ documentId }: getBankProps) => {
    try {
        const { database } = await createAdminClient();
        const bank = await database.listDocuments(DATABASE_ID!, BANK_COLLECTION_ID!, [Query.equal("$id", [documentId])]);
        return parseStringify(bank.documents[0]);
    } catch (error) {
        console.error(error);
    }
}