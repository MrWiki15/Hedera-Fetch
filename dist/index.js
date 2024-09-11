var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const mainetBaseUrl = "https://mainnet.mirrornode.hedera.com/";
//Acounts
export function fetchAccounts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ lt, lte, gt, gte, order, account, transactionType, }) {
        try {
            const params = {};
            // Validar filtros generales
            if (lt && lt !== "gt" && lt !== "gte" && lt !== "lt" && lt !== "lte") {
                throw new Error("Invalid value for 'lt'. Must be a valid filter.");
            }
            if (lte && lte !== "gt" && lte !== "gte" && lte !== "lt" && lte !== "lte") {
                throw new Error("Invalid value for 'lte'. Must be a valid filter.");
            }
            if (gt && gt !== "gt" && gt !== "gte" && gt !== "lt" && gt !== "lte") {
                throw new Error("Invalid value for 'gt'. Must be a valid filter.");
            }
            if (gte && gte !== "gt" && gte !== "gte" && gte !== "lt" && gte !== "lte") {
                throw new Error("Invalid value for 'gte'. Must be a valid filter.");
            }
            if (order && !["asc", "desc"].includes(order)) {
                throw new Error("Invalid value for 'order'. Must be 'asc' or 'desc'.");
            }
            // Agregar filtros generales
            if (lt)
                params[`account.id=lt`] = lt;
            if (lte)
                params[`account.id=lte`] = lte;
            if (gt)
                params[`account.id=gt`] = gt;
            if (gte)
                params[`account.id=gte`] = gte;
            if (order)
                params.order = order;
            // Validar y agregar filtros específicos para el parámetro account
            if (account) {
                if (account.id) {
                    if (typeof account.id !== "string" || !/^0\.0\.\d+$/.test(account.id)) {
                        throw new Error("Invalid format for 'account.id'. Must be in the format '0.0.<number>'.");
                    }
                    params[`account.id`] = account.id;
                }
                if (account.balance) {
                    if (!["gt", "gte", "lt", "lte"].includes(account.balance.op)) {
                        throw new Error("Invalid operator for 'account.balance'. Must be 'gt', 'gte', 'lt', or 'lte'.");
                    }
                    if (typeof account.balance.value !== "string") {
                        throw new Error("Invalid value for 'account.balance'. Must be a string.");
                    }
                    params[`account.balance`] = `${account.balance.op}:${account.balance.value}`;
                }
                if (account.publickey) {
                    if (typeof account.publickey !== "string") {
                        throw new Error("Invalid format for 'account.publickey'. Must be a string.");
                    }
                    params[`account.publickey`] = account.publickey;
                }
            }
            // Validar parámetro transactionType
            if (transactionType) {
                if (!account || !account.id) {
                    throw new Error("Account ID is required for 'transactionType'.");
                }
                return fetch(`${mainetBaseUrl}api/v1/accounts/${account.id}?transactionType=${transactionType}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }).then((response) => response.json());
            }
            // Crear la URL con los parámetros de consulta solo si existen
            const queryString = new URLSearchParams(params).toString();
            const url = `${mainetBaseUrl}api/v1/accounts${queryString ? `?${queryString}` : ""}`;
            console.info("Request URL:", url); // Verifica la URL generada
            const response = yield fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error(error);
            throw new Error("Error fetching accounts: " + error);
        }
    });
}
export function fetchAccount(account) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Si la cuenta no existe, se lanza una excepción
            if (!account) {
                throw new Error("Account is required");
            }
            const response = yield fetch(`${mainetBaseUrl}api/v1/accounts/${account}`);
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error(error);
            throw new Error("Error fetching account data");
        }
    });
}
export function fetchAccountTokensAsociated(account) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Si la cuenta no existe, se lanza una excepción
            if (!account) {
                throw new Error("Account is required");
            }
            const response = yield fetch(`${mainetBaseUrl}api/v1/accounts/${account}/tokens`);
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error(error);
            throw new Error("Error fetching account tokens associated");
        }
    });
}
export function fetchAccountNFTs(account_1, _a) {
    return __awaiter(this, arguments, void 0, function* (account, { tokenId, tokenIdOperator, serialNumber, serialNumberOperator, spenderId, spenderIdOperator, order = "desc", }) {
        try {
            // Validar cuenta
            if (!account) {
                throw new Error("Account is required.");
            }
            // Validar y construir los parámetros de consulta
            const params = {};
            if (tokenId) {
                if (!["eq", "ne", "lt", "lte", "gt", "gte"].includes(tokenIdOperator || "eq")) {
                    throw new Error("Invalid operator for 'tokenId'.");
                }
                params[`token.id${tokenIdOperator ? `=${tokenIdOperator}` : ""}`] =
                    tokenId;
            }
            if (serialNumber) {
                if (!["eq", "lt", "lte", "gt", "gte"].includes(serialNumberOperator || "eq")) {
                    throw new Error("Invalid operator for 'serialNumber'.");
                }
                params[`serialnumber${serialNumberOperator ? `=${serialNumberOperator}` : ""}`] = serialNumber;
            }
            if (spenderId) {
                if (!["eq", "lt", "gt"].includes(spenderIdOperator || "eq")) {
                    throw new Error("Invalid operator for 'spenderId'.");
                }
                params[`spender.id${spenderIdOperator ? `=${spenderIdOperator}` : ""}`] =
                    spenderId;
            }
            if (!["asc", "desc"].includes(order)) {
                throw new Error("Invalid value for 'order'. Must be 'asc' or 'desc'.");
            }
            params.order = order;
            // Construir la URL con los parámetros de consulta
            const queryString = new URLSearchParams(params).toString();
            const url = `${mainetBaseUrl}api/v1/accounts/${account}/nfts${queryString ? `?${queryString}` : ""}`;
            console.log("Request URL:", url); // Verifica la URL generada
            const response = yield fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error("Error fetching account NFTs:", error);
            throw new Error("Error fetching account NFTs: " + error);
        }
    });
}
export function fetchAccountRewards(account) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Si la cuenta no existe, se lanza una excepción
            if (!account) {
                throw new Error("Account is required");
            }
            const response = yield fetch(`${mainetBaseUrl}api/v1/accounts/${account}/rewards`);
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error(error);
            throw new Error("Error fetching account rewards");
        }
    });
}
//Balances
export function fetchBalances() {
    return __awaiter(this, arguments, void 0, function* ({ accountId, accountIdOperator, balance, balanceOperator, timestamp, publicKey, order = "desc", } = {}) {
        try {
            // Validar y construir los parámetros de consulta
            const params = {};
            if (accountId) {
                if (!["eq", "lt", "lte", "gt", "gte"].includes(accountIdOperator || "eq")) {
                    throw new Error("Invalid operator for 'accountId'.");
                }
                params[`account.id${accountIdOperator ? `=${accountIdOperator}` : ""}`] =
                    accountId;
            }
            if (balance) {
                if (!["eq", "lt", "lte", "gt", "gte"].includes(balanceOperator || "eq")) {
                    throw new Error("Invalid operator for 'balance'.");
                }
                params[`account.balance${balanceOperator ? `=${balanceOperator}` : ""}`] =
                    balance;
            }
            if (timestamp) {
                if (!/^\d+\.\d{9}$/.test(timestamp)) {
                    throw new Error("Invalid format for 'timestamp'. Must be in seconds.nanoseconds format.");
                }
                params.timestamp = timestamp;
            }
            if (publicKey) {
                if (typeof publicKey !== "string") {
                    throw new Error("Invalid format for 'publicKey'. Must be a string.");
                }
                params["account.publickey"] = publicKey;
            }
            if (!["asc", "desc"].includes(order)) {
                throw new Error("Invalid value for 'order'. Must be 'asc' or 'desc'.");
            }
            params.order = order;
            // Construir la URL con los parámetros de consulta
            const queryString = new URLSearchParams(params).toString();
            const url = `${mainetBaseUrl}api/v1/balances${queryString ? `?${queryString}` : ""}`;
            console.log("Request URL:", url); // Verifica la URL generada
            const response = yield fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error("Error fetching balances:", error);
            throw new Error("Error fetching balances: " + error);
        }
    });
}
// Transactions
export function fetchTransactions() {
    return __awaiter(this, arguments, void 0, function* ({ accountId, accountIdOperator, timestamp, result, transactionType, order = "desc", } = {}) {
        try {
            // Validar y construir los parámetros de consulta
            const params = {};
            if (accountId) {
                if (!["eq", "lt", "lte", "gt", "gte"].includes(accountIdOperator || "eq")) {
                    throw new Error("Invalid operator for 'accountId'.");
                }
                params[`account.id${accountIdOperator ? `=${accountIdOperator}` : ""}`] =
                    accountId;
            }
            if (timestamp) {
                if (!/^\d+\.\d{9}$/.test(timestamp)) {
                    throw new Error("Invalid format for 'timestamp'. Must be in seconds.nanoseconds format.");
                }
                params.timestamp = timestamp;
            }
            if (result) {
                if (!["success", "fail"].includes(result)) {
                    throw new Error("Invalid value for 'result'. Must be 'success' or 'fail'.");
                }
                params.result = result;
            }
            if (transactionType) {
                params.transactionType = transactionType;
            }
            if (!["asc", "desc"].includes(order)) {
                throw new Error("Invalid value for 'order'. Must be 'asc' or 'desc'.");
            }
            params.order = order;
            // Construir la URL con los parámetros de consulta
            const queryString = new URLSearchParams(params).toString();
            const url = `${mainetBaseUrl}api/v1/transactions${queryString ? `?${queryString}` : ""}`;
            console.log("Request URL:", url); // Verifica la URL generada
            const response = yield fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error("Error fetching transactions:", error);
            throw new Error("Error fetching transactions: " + error);
        }
    });
}
export function fetchTransactionsAccount(account_1) {
    return __awaiter(this, arguments, void 0, function* (account, filters = {}) {
        try {
            // Validar la cuenta
            if (!account) {
                throw new Error("Account is required");
            }
            if (!account.startsWith("0.0")) {
                throw new Error("Account must start with 0.0");
            }
            // Llamar a fetchTransactions con el accountId y filtros
            return yield fetchTransactions(Object.assign({ accountId: account, accountIdOperator: "eq" }, filters));
        }
        catch (error) {
            console.error("Error fetching transactions for account:", error);
            throw new Error("Error fetching transactions for account: " + error);
        }
    });
}
//Topics
export function fetchTopicMessages(topicId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Validar topicId
            if (!topicId) {
                throw new Error("Topic id is required.");
            }
            // Verificar el formato del topicId
            if (!/^0\.0\.\d+$/.test(topicId)) {
                throw new Error("Invalid format for 'topicId'. Must be in the format '0.0.<number>'.");
            }
            const response = yield fetch(`${mainetBaseUrl}api/v1/topics/${topicId}/messages`);
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error("Error fetching topic messages:", error);
            throw new Error("Error fetching topic messages: " + error);
        }
    });
}
export function fetchTopicMessageBySequenceNumber(topicId, sequenceNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Validar topicId
            if (!topicId) {
                throw new Error("Topic id is required.");
            }
            // Verificar el formato del topicId
            if (!/^0\.0\.\d+$/.test(topicId)) {
                throw new Error("Invalid format for 'topicId'. Must be in the format '0.0.<number>'.");
            }
            // Validar sequenceNumber
            if (sequenceNumber <= 0) {
                throw new Error("Sequence number must be a positive integer.");
            }
            const response = yield fetch(`${mainetBaseUrl}api/v1/topics/${topicId}/messages/${sequenceNumber}`);
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error("Error fetching topic message by sequence number:", error);
            throw new Error("Error fetching topic message by sequence number: " + error);
        }
    });
}
export function fetchTopicMessageByTimestamp(timestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Validar timestamp
            if (!timestamp) {
                throw new Error("Consensus timestamp is required.");
            }
            // Verificar formato del timestamp (seconds.nanoseconds)
            if (!/^\d+\.\d{9}$/.test(timestamp)) {
                throw new Error("Invalid format for 'timestamp'. Must be in the format 'seconds.nanoseconds'.");
            }
            const response = yield fetch(`${mainetBaseUrl}api/v1/topics/messages/${timestamp}`);
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error("Error fetching topic message by timestamp:", error);
            throw new Error("Error fetching topic message by timestamp: " + error);
        }
    });
}
// Tokens
export function fetchTokens() {
    return __awaiter(this, arguments, void 0, function* ({ publicKey, accountId, tokenId, tokenIdOperator, order = "desc", limit, } = {}) {
        try {
            // Validar y construir los parámetros de consulta
            const params = {};
            if (publicKey) {
                params.publickey = publicKey;
            }
            if (accountId) {
                if (!/^0\.0\.\d+$/.test(accountId)) {
                    throw new Error("Invalid format for 'accountId'. Must be in the format '0.0.<number>'.");
                }
                params["account.id"] = accountId;
            }
            if (tokenId) {
                if (!["eq", "lt", "lte", "gt", "gte"].includes(tokenIdOperator || "eq")) {
                    throw new Error("Invalid operator for 'tokenId'.");
                }
                params[`token.id${tokenIdOperator ? `=${tokenIdOperator}` : ""}`] =
                    tokenId;
            }
            if (!["asc", "desc"].includes(order)) {
                throw new Error("Invalid value for 'order'. Must be 'asc' or 'desc'.");
            }
            params.order = order;
            if (limit) {
                if (limit <= 0) {
                    throw new Error("Limit must be a positive number.");
                }
                params.limit = limit.toString();
            }
            // Construir la URL con los parámetros de consulta
            const queryString = new URLSearchParams(params).toString();
            const url = `${mainetBaseUrl}api/v1/tokens${queryString ? `?${queryString}` : ""}`;
            console.log("Request URL:", url); // Verifica la URL generada
            const response = yield fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error("Error fetching tokens:", error);
            throw new Error("Error fetching tokens: " + error);
        }
    });
}
export function fetchToken(tokenId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!tokenId) {
                throw new Error("Token id is required");
            }
            const response = yield fetch(`${mainetBaseUrl}api/v1/tokens/${tokenId}`);
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error(error);
            throw new Error("Error fetching token");
        }
    });
}
export function fetchTokenBalances(tokenId_1) {
    return __awaiter(this, arguments, void 0, function* (tokenId, { accountId, accountIdOperator, accountBalance, accountBalanceOperator, timestamp, order = "desc", } = {}) {
        try {
            // Validar tokenId
            if (!tokenId) {
                throw new Error("Token id is required.");
            }
            // Validar y construir los parámetros de consulta
            const params = {};
            if (accountId) {
                if (!/^0\.0\.\d+$/.test(accountId)) {
                    throw new Error("Invalid format for 'accountId'. Must be in the format '0.0.<number>'.");
                }
                params[`account.id${accountIdOperator ? `=${accountIdOperator}` : ""}`] =
                    accountId;
            }
            if (accountBalance) {
                if (!["eq", "lt", "lte", "gt", "gte"].includes(accountBalanceOperator || "eq")) {
                    throw new Error("Invalid operator for 'accountBalance'.");
                }
                params[`account.balance${accountBalanceOperator ? `=${accountBalanceOperator}` : ""}`] = accountBalance;
            }
            if (timestamp) {
                if (!/^\d+\.\d{9}$/.test(timestamp)) {
                    throw new Error("Invalid format for 'timestamp'. Must be in the format 'seconds.nanoseconds'.");
                }
                params.timestamp = timestamp;
            }
            if (!["asc", "desc"].includes(order)) {
                throw new Error("Invalid value for 'order'. Must be 'asc' or 'desc'.");
            }
            params.order = order;
            // Construir la URL con los parámetros de consulta
            const queryString = new URLSearchParams(params).toString();
            const url = `${mainetBaseUrl}api/v1/tokens/${tokenId}/balances${queryString ? `?${queryString}` : ""}`;
            console.log("Request URL:", url); // Verifica la URL generada
            const response = yield fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error("Error fetching token balances:", error);
            throw new Error("Error fetching token balances: " + error);
        }
    });
}
export function fetchTokenNfts(tokenId_1) {
    return __awaiter(this, arguments, void 0, function* (tokenId, { accountId, limit, order = "desc", serialNumber, } = {}) {
        try {
            // Validar tokenId
            if (!tokenId) {
                throw new Error("Token id is required.");
            }
            // Validar y construir los parámetros de consulta
            const params = {};
            if (accountId) {
                if (!/^0\.0\.\d+$/.test(accountId)) {
                    throw new Error("Invalid format for 'accountId'. Must be in the format '0.0.<number>'.");
                }
                params["account.id"] = accountId;
            }
            if (limit) {
                if (limit <= 0) {
                    throw new Error("Limit must be a positive number.");
                }
                params.limit = limit.toString();
            }
            if (serialNumber) {
                params.serialnumber = serialNumber;
            }
            if (!["asc", "desc"].includes(order)) {
                throw new Error("Invalid value for 'order'. Must be 'asc' or 'desc'.");
            }
            params.order = order;
            // Construir la URL con los parámetros de consulta
            const queryString = new URLSearchParams(params).toString();
            const url = `${mainetBaseUrl}api/v1/tokens/${tokenId}/nfts${queryString ? `?${queryString}` : ""}`;
            console.log("Request URL:", url); // Verifica la URL generada
            const response = yield fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error("Error fetching token NFTs:", error);
            throw new Error("Error fetching token NFTs: " + error);
        }
    });
}
export function fetchTokenNftSerialNumber(tokenId, serialNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!tokenId) {
                throw new Error("Token id is required");
            }
            if (!serialNumber) {
                throw new Error("Serial number is required");
            }
            const response = yield fetch(`${mainetBaseUrl}api/v1/tokens/${tokenId}/nfts/${serialNumber}`);
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error(error);
            throw new Error("Error fetching token serial number");
        }
    });
}
export function fetchNftTransactionHistory(tokenID_1, serialNumber_1) {
    return __awaiter(this, arguments, void 0, function* (tokenID, serialNumber, { limit, order = "desc", timestamp, } = {}) {
        try {
            // Validar tokenID y serialNumber
            if (!tokenID) {
                throw new Error("Nft id is required.");
            }
            if (!/^0\.0\.\d+$/.test(tokenID)) {
                throw new Error("Invalid format for 'tokenID'. Must be in the format '0.0.<number>'.");
            }
            if (!serialNumber) {
                throw new Error("Serial number is required.");
            }
            // Validar y construir los parámetros de consulta
            const params = {};
            if (limit) {
                if (limit <= 0) {
                    throw new Error("Limit must be a positive number.");
                }
                params.limit = limit.toString();
            }
            if (!["asc", "desc"].includes(order)) {
                throw new Error("Invalid value for 'order'. Must be 'asc' or 'desc'.");
            }
            params.order = order;
            if (timestamp) {
                if (!/^\d+\.\d{9}$/.test(timestamp)) {
                    throw new Error("Invalid format for 'timestamp'. Must be in the format 'seconds.nanoseconds'.");
                }
                params.timestamp = timestamp;
            }
            // Construir la URL con los parámetros de consulta
            const queryString = new URLSearchParams(params).toString();
            const url = `${mainetBaseUrl}api/v1/tokens/${tokenID}/nfts/${serialNumber}/transactions${queryString ? `?${queryString}` : ""}`;
            console.log("Request URL:", url); // Verifica la URL generada
            const response = yield fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error("Error fetching NFT transaction history:", error);
            throw new Error("Error fetching NFT transaction history: " + error);
        }
    });
}
// Contracts
export function fetchContracts() {
    return __awaiter(this, arguments, void 0, function* ({ contractId, limit, order = "desc", } = {}) {
        try {
            // Validar y construir los parámetros de consulta
            const params = {};
            if (contractId) {
                if (!/^0\.0\.\d+$/.test(contractId)) {
                    throw new Error("Invalid format for 'contractId'. Must be in the format '0.0.<number>'.");
                }
                params["contract.id"] = contractId;
            }
            if (limit) {
                if (limit <= 0) {
                    throw new Error("Limit must be a positive number.");
                }
                params.limit = limit.toString();
            }
            if (!["asc", "desc"].includes(order)) {
                throw new Error("Invalid value for 'order'. Must be 'asc' or 'desc'.");
            }
            params.order = order;
            // Construir la URL con los parámetros de consulta
            const queryString = new URLSearchParams(params).toString();
            const url = `${mainetBaseUrl}api/v1/contracts${queryString ? `?${queryString}` : ""}`;
            console.log("Request URL:", url); // Verifica la URL generada
            const response = yield fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error("Error fetching contracts:", error);
            throw new Error("Error fetching contracts: " + error);
        }
    });
}
export function fetchContract(contract) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!contract) {
                throw new Error("Contract is required");
            }
            const response = yield fetch(`${mainetBaseUrl}api/v1/contracts/${contract}`);
            return yield response.json();
        }
        catch (error) {
            console.error(error);
            throw new Error("Error fetching contract");
        }
    });
}
export function fetchContractLogs(contract) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!contract) {
                throw new Error("Contract is required");
            }
            const response = yield fetch(`${mainetBaseUrl}api/v1/contracts/${contract}/results/logs`);
            return yield response.json();
        }
        catch (error) {
            console.error(error);
            throw new Error("Error fetching contract logs");
        }
    });
}
// Blocks
export function fetchBlocks() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${mainetBaseUrl}api/v1/blocks`);
            return yield response.json();
        }
        catch (error) {
            console.error(error);
            throw new Error("Error fetching blocks");
        }
    });
}
export function fetchBlock(block) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!block) {
                throw new Error("Block is required");
            }
            const response = yield fetch(`${mainetBaseUrl}api/v1/blocks/${block}`);
            return yield response.json();
        }
        catch (error) {
            console.error(error);
            throw new Error("Error fetching block");
        }
    });
}
// Nodes
export function fetchNodes() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${mainetBaseUrl}api/v1/network/nodes`);
            return yield response.json();
        }
        catch (error) {
            console.error(error);
            throw new Error("Error fetching nodes");
        }
    });
}
// Network
export function fetchNetworkSupply() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${mainetBaseUrl}api/v1/network/supply`);
            return yield response.json();
        }
        catch (error) {
            console.error(error);
            throw new Error("Error fetching network");
        }
    });
}
export function fetchNetworkFees() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${mainetBaseUrl}api/v1/network/fees`);
            return yield response.json();
        }
        catch (error) {
            console.error(error);
            throw new Error("Error fetching network fees");
        }
    });
}
//# sourceMappingURL=index.js.map