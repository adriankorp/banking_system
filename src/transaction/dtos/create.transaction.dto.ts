export interface CreateTransactionDto {
    customerId: string;
    amount: number;
    title: string;
    description: string;
    to: string;
    fromAccount: string;
    toAccount: string;
}
