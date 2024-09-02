import { AccountBase, ACHClass, TransferNetwork, TransferType } from "plaid"
import { z } from "zod"

export const authFormSchema = (type: string) => z.object({
    firstName: type === "sign-in" ? z.string().optional() : z.string().min(3),
    lastName: type === "sign-in" ? z.string().optional() : z.string().min(3),
    address1: type === "sign-in" ? z.string().optional() : z.string().max(50),
    city: type === "sign-in" ? z.string().optional() : z.string().max(50),
    state: type === "sign-in" ? z.string().optional() : z.string().min(2).max(2),
    postalCode: type === "sign-in" ? z.string().optional() : z.string().min(3).max(6),
  
    dateOfBirth:
      type === "sign-in" ? z.string().optional() : z.string().regex(
        /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-(19|20)\d\d$/,
        "Date of birth must be in format DD-MM-YYYY"
      ).refine((date) => {
        const [day, month, year] = date.split('-').map(Number);
        const parsedDate = new Date(year, month - 1, day);
        return parsedDate <= new Date();
      }, "Date of birth cannot be in the future"),
  
    ssn: type === "sign-in" ? z.string().optional() : z.string().min(4, "SSN must be 4 numbers long").max(4),
    email: z.string().email(),
    password: type === "sign-in"
      ? z.string()
      : z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  });
  
  export const transferFormSchema = () => z.object({
    email: z.string().email("Invalid email address"),
    name: z.string(),
    amount: z.string().min(1, "Amount is too short"),
    senderBank: z.string().min(4, "Please select a valid bank account"),
    sharableId: z.string().min(8, "Please select a valid sharable Id"),
  });

export const userDataTemplate = (data: z.infer<any>, formattedDateOfBirth: string) => {
    return {
        firstName: data.firstName!,
        lastName: data.lastName!,
        address1: data.address1!,
        city: data.city!,
        state: data.state!,
        postalCode: data.postalCode!,
        dateOfBirth: formattedDateOfBirth,
        ssn: data.ssn!,
        email: data.email,
        password: data.password
    }
}

export const transferDataTemplate = (transferData: Transaction, bank: any) => {
    return {
        id: transferData.$id,
        name: transferData.name!,
        amount: transferData.amount!,
        date: transferData.$createdAt,
        paymentChannel: transferData.channel,
        category: transferData.category,
        type: transferData.senderBankId === bank.$id ? "debit" : "credit",
    }
}

export const accountDataTemplate = (accountData: AccountBase, institution: any, bank: Bank) => {
    return {
        id: accountData.account_id,
        availableBalance: accountData.balances.available!,
        currentBalance: accountData.balances.current!,
        institutionId: institution.institution_id,
        name: accountData.name,
        officialName: accountData.official_name,
        mask: accountData.mask!,
        type: accountData.type as string,
        subtype: accountData.subtype! as string,
        appwriteItemId: bank.$id,
    };
}

export const transactionDataTemplate = (transaction: any) => {
    return {
        id: transaction.transaction_id,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        type: transaction.payment_channel,
        accountId: transaction.account_id,
        amount: transaction.amount,
        pending: transaction.pending,
        category: transaction.category ? transaction.category[0] : "",
        date: transaction.date,
        image: transaction.logo_url,
    }
}

export const transferAuthRequestTemplate = () => {
    return {
        access_token: "access-sandbox-cddd20c1-5ba8-4193-89f9-3a0b91034c25",
        account_id: "Zl8GWV1jqdTgjoKnxQn1HBxxVBanm5FxZpnQk",
        funding_account_id: "442d857f-fe69-4de2-a550-0c19dc4af467",
        type: "credit" as TransferType,
        network: "ach" as TransferNetwork,
        amount: "10.00",
        ach_class: "ppd" as ACHClass,
        user: {
            legal_name: "Anne Charleston",
        }
    };
}

export const transferCreateRequestTemplate = (authorizationId: string) => {
    return {
        access_token: "access-sandbox-cddd20c1-5ba8-4193-89f9-3a0b91034c25",
        account_id: "Zl8GWV1jqdTgjoKnxQn1HBxxVBanm5FxZpnQk",
        description: "payment",
        authorization_id: authorizationId,
    }
}

export const dwollaRequestBody = ({sourceFundingSourceUrl, destinationFundingSourceUrl, amount}: TransferParams) => {
    return {
        _links: {
            source: {href: sourceFundingSourceUrl},
            destination: {href: destinationFundingSourceUrl},
        },
        amount: {
            currency: "EURO",
            value: amount,
        },
    }
}