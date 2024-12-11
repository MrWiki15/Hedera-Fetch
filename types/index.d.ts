export declare function fetchAccounts({ lt, lte, gt, gte, order, account, transactionType, }: {
    lt?: string;
    lte?: string;
    gt?: string;
    gte?: string;
    order?: string;
    account?: {
        id?: string;
        balance?: {
            op: "gt" | "gte" | "lt" | "lte";
            value: string;
        };
        publickey?: string;
    };
    transactionType?: string;
}): Promise<any>;
export declare function fetchAccount(account: string): Promise<any>;
export declare function fetchAccountTokensAsociated(account: string): Promise<any>;
export declare function fetchAccountNFTs(account: string, { tokenId, tokenIdOperator, serialNumber, serialNumberOperator, spenderId, spenderIdOperator, order, }: {
    tokenId?: string;
    tokenIdOperator?: "eq" | "ne" | "lt" | "lte" | "gt" | "gte";
    serialNumber?: string;
    serialNumberOperator?: "eq" | "lt" | "lte" | "gt" | "gte";
    spenderId?: string;
    spenderIdOperator?: "eq" | "lt" | "gt";
    order?: "asc" | "desc";
}): Promise<any>;
export declare function fetchAccountRewards(account: string): Promise<any>;
export declare function fetchBalances({ accountId, accountIdOperator, balance, balanceOperator, timestamp, publicKey, order, }?: {
    accountId?: string;
    accountIdOperator?: "eq" | "lt" | "lte" | "gt" | "gte";
    balance?: string;
    balanceOperator?: "eq" | "lt" | "lte" | "gt" | "gte";
    timestamp?: string;
    publicKey?: string;
    order?: "asc" | "desc";
}): Promise<any>;
export declare function fetchTransactions({ accountId, accountIdOperator, timestamp, result, transactionType, order, }?: {
    accountId?: string;
    accountIdOperator?: "eq" | "lt" | "lte" | "gt" | "gte";
    timestamp?: string;
    result?: "success" | "fail";
    transactionType?: string;
    order?: "asc" | "desc";
}): Promise<any>;
export declare function fetchTransactionsAccount(account: string, filters?: {
    timestamp?: string;
    result?: "success" | "fail";
    transactionType?: string;
    order?: "asc" | "desc";
}): Promise<any>;
export declare function fetchTopicMessages(topicId: string): Promise<any>;
export declare function fetchTopicMessageBySequenceNumber(topicId: string, sequenceNumber: number): Promise<any>;
export declare function fetchTopicMessageByTimestamp(timestamp: string): Promise<any>;
export declare function fetchTokens({ publicKey, accountId, tokenId, tokenIdOperator, order, limit, }?: {
    publicKey?: string;
    accountId?: string;
    tokenId?: string;
    tokenIdOperator?: "eq" | "lt" | "lte" | "gt" | "gte";
    order?: "asc" | "desc";
    limit?: number;
}): Promise<any>;
export declare function fetchToken(tokenId: string): Promise<any>;
export declare function fetchTokenBalances(tokenId: string, { accountId, accountIdOperator, accountBalance, accountBalanceOperator, timestamp, order, }?: {
    accountId?: string;
    accountIdOperator?: "eq" | "lt" | "lte" | "gt" | "gte";
    accountBalance?: string;
    accountBalanceOperator?: "eq" | "lt" | "lte" | "gt" | "gte";
    timestamp?: string;
    order?: "asc" | "desc";
}): Promise<any>;
export declare function fetchTokenNfts(tokenId: string, { accountId, limit, order, serialNumber, }?: {
    accountId?: string;
    limit?: number;
    order?: "asc" | "desc";
    serialNumber?: string;
}): Promise<any>;
export declare function fetchTokenNftSerialNumber(tokenId: string, serialNumber: string): Promise<any>;
export declare function fetchNftTransactionHistory(tokenID: string, serialNumber: string, { limit, order, timestamp, }?: {
    limit?: number;
    order?: "asc" | "desc";
    timestamp?: string;
}): Promise<any>;
export declare function fetchContracts({ contractId, limit, order, }?: {
    contractId?: string;
    limit?: number;
    order?: "asc" | "desc";
}): Promise<any>;
export declare function fetchContract(contract: string): Promise<any>;
export declare function fetchContractLogs(contract: string): Promise<any>;
export declare function fetchBlocks(): Promise<any>;
export declare function fetchBlock(block: string): Promise<any>;
export declare function fetchNodes(): Promise<any>;
export declare function fetchNetworkSupply(): Promise<any>;
export declare function fetchNetworkFees(): Promise<any>;
