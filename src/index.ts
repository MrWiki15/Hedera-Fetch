const mainetBaseUrl = "https://mainnet.mirrornode.hedera.com/";

//Acounts
export async function fetchAccounts({
  lt,
  lte,
  gt,
  gte,
  order,
  account,
  transactionType,
}: {
  lt?: string;
  lte?: string;
  gt?: string;
  gte?: string;
  order?: string;
  account?: {
    id?: string;
    balance?: { op: "gt" | "gte" | "lt" | "lte"; value: string };
    publickey?: string;
  };
  transactionType?: string;
}): Promise<any> {
  try {
    const params: Record<string, string> = {};

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
    if (lt) params[`account.id=lt`] = lt;
    if (lte) params[`account.id=lte`] = lte;
    if (gt) params[`account.id=gt`] = gt;
    if (gte) params[`account.id=gte`] = gte;
    if (order) params.order = order;

    // Validar y agregar filtros específicos para el parámetro account
    if (account) {
      if (account.id) {
        if (typeof account.id !== "string" || !/^0\.0\.\d+$/.test(account.id)) {
          throw new Error(
            "Invalid format for 'account.id'. Must be in the format '0.0.<number>'."
          );
        }
        params[`account.id`] = account.id;
      }
      if (account.balance) {
        if (!["gt", "gte", "lt", "lte"].includes(account.balance.op)) {
          throw new Error(
            "Invalid operator for 'account.balance'. Must be 'gt', 'gte', 'lt', or 'lte'."
          );
        }
        if (typeof account.balance.value !== "string") {
          throw new Error(
            "Invalid value for 'account.balance'. Must be a string."
          );
        }
        params[
          `account.balance`
        ] = `${account.balance.op}:${account.balance.value}`;
      }
      if (account.publickey) {
        if (typeof account.publickey !== "string") {
          throw new Error(
            "Invalid format for 'account.publickey'. Must be a string."
          );
        }
        params[`account.publickey`] = account.publickey;
      }
    }

    // Validar parámetro transactionType
    if (transactionType) {
      if (!account || !account.id) {
        throw new Error("Account ID is required for 'transactionType'.");
      }
      return fetch(
        `${mainetBaseUrl}api/v1/accounts/${account.id}?transactionType=${transactionType}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((response) => response.json());
    }

    // Crear la URL con los parámetros de consulta solo si existen
    const queryString = new URLSearchParams(params).toString();
    const url = `${mainetBaseUrl}api/v1/accounts${
      queryString ? `?${queryString}` : ""
    }`;

    console.info("Request URL:", url); // Verifica la URL generada

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching accounts: " + error);
  }
}

export async function fetchAccount(account: string): Promise<any> {
  try {
    // Si la cuenta no existe, se lanza una excepción
    if (!account) {
      throw new Error("Account is required");
    }

    const response = await fetch(`${mainetBaseUrl}api/v1/accounts/${account}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching account data");
  }
}

export async function fetchAccountTokensAsociated(
  account: string
): Promise<any> {
  try {
    // Si la cuenta no existe, se lanza una excepción
    if (!account) {
      throw new Error("Account is required");
    }

    const response = await fetch(
      `${mainetBaseUrl}api/v1/accounts/${account}/tokens`
    );
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching account tokens associated");
  }
}

export async function fetchAccountNFTs(
  account: string,
  {
    tokenId,
    tokenIdOperator,
    serialNumber,
    serialNumberOperator,
    spenderId,
    spenderIdOperator,
    order = "desc",
  }: {
    tokenId?: string;
    tokenIdOperator?: "eq" | "ne" | "lt" | "lte" | "gt" | "gte";
    serialNumber?: string;
    serialNumberOperator?: "eq" | "lt" | "lte" | "gt" | "gte";
    spenderId?: string;
    spenderIdOperator?: "eq" | "lt" | "gt";
    order?: "asc" | "desc";
  }
): Promise<any> {
  try {
    // Validar cuenta
    if (!account) {
      throw new Error("Account is required.");
    }

    // Validar y construir los parámetros de consulta
    const params: Record<string, string> = {};

    if (tokenId) {
      if (
        !["eq", "ne", "lt", "lte", "gt", "gte"].includes(
          tokenIdOperator || "eq"
        )
      ) {
        throw new Error("Invalid operator for 'tokenId'.");
      }
      params[`token.id${tokenIdOperator ? `=${tokenIdOperator}` : ""}`] =
        tokenId;
    }

    if (serialNumber) {
      if (
        !["eq", "lt", "lte", "gt", "gte"].includes(serialNumberOperator || "eq")
      ) {
        throw new Error("Invalid operator for 'serialNumber'.");
      }
      params[
        `serialnumber${serialNumberOperator ? `=${serialNumberOperator}` : ""}`
      ] = serialNumber;
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
    const url = `${mainetBaseUrl}api/v1/accounts/${account}/nfts${
      queryString ? `?${queryString}` : ""
    }`;

    console.log("Request URL:", url); // Verifica la URL generada

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching account NFTs:", error);
    throw new Error("Error fetching account NFTs: " + error);
  }
}

export async function fetchAccountRewards(account: string): Promise<any> {
  try {
    // Si la cuenta no existe, se lanza una excepción
    if (!account) {
      throw new Error("Account is required");
    }

    const response = await fetch(
      `${mainetBaseUrl}api/v1/accounts/${account}/rewards`
    );
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching account rewards");
  }
}

//Balances
export async function fetchBalances(): Promise<any> {
  try {
    const response = await fetch(`${mainetBaseUrl}api/v1/balances`);
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching balances");
  }
}

// Transactions
export async function fetchTransactions(): Promise<any> {
  try {
    const response = await fetch(`${mainetBaseUrl}api/v1/transactions`);
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching transactions");
  }
}

export async function fetchTransactionsAccount(account: string): Promise<any> {
  try {
    // Si la cuenta no existe, se lanza una excepción
    if (!account) {
      throw new Error("Account is required");
    }

    // Si la cuenta no empieza con 0.0, se lanza una excepción
    if (!account.startsWith("0.0")) {
      throw new Error("Account must start with 0.0");
    }

    const response = await fetch(
      `${mainetBaseUrl}api/v1/transactions/{account}`
    );
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching transactions");
  }
}

//Topics
export async function fetchTopics(topicId: string): Promise<any> {
  try {
    if (!topicId) {
      throw new Error("Topic id is required");
    }

    const response = await fetch(`${mainetBaseUrl}api/v1/topics/${topicId}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching topics");
  }
}

// Tokens
export async function fetchTokens(): Promise<any> {
  try {
    const response = await fetch(`${mainetBaseUrl}api/v1/tokens`);
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching tokens");
  }
}

export async function fetchToken(tokenId: string): Promise<any> {
  try {
    if (!tokenId) {
      throw new Error("Token id is required");
    }

    const response = await fetch(`${mainetBaseUrl}api/v1/tokens/${tokenId}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching token");
  }
}

export async function fetchTokenBalances(tokenId: string): Promise<any> {
  try {
    if (!tokenId) {
      throw new Error("Token id is required");
    }

    const response = await fetch(
      `${mainetBaseUrl}api/v1/tokens/${tokenId}/balances`
    );
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching token balance");
  }
}

export async function fetchTokenNfts(tokenId: string): Promise<any> {
  try {
    if (!tokenId) {
      throw new Error("Token id is required");
    }

    const response = await fetch(
      `${mainetBaseUrl}api/v1/tokens/${tokenId}/nfts`
    );
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching token nfts");
  }
}

export async function fetchTokenSerialNumber(
  tokenId: string,
  serialNumber: string
): Promise<any> {
  try {
    if (!tokenId) {
      throw new Error("Token id is required");
    }

    if (!serialNumber) {
      throw new Error("Serial number is required");
    }

    const response = await fetch(
      `${mainetBaseUrl}api/v1/tokens/${tokenId}/nfts/${serialNumber}`
    );
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching token serial number");
  }
}

export async function fetchNftTransactionHistory(
  tokenID: string,
  serialNumber: string
): Promise<any> {
  try {
    if (!tokenID) {
      throw new Error("Nft id is required");
    }

    if (!serialNumber) {
      throw new Error("Serial number is required");
    }

    const response = await fetch(
      `${mainetBaseUrl}api/v1/tokens/${tokenID}/nfts/${serialNumber}/transactions`
    );
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching nft transaction history");
  }
}

// Contracts
export async function fetchContracts(): Promise<any> {
  try {
    const response = await fetch(`${mainetBaseUrl}api/v1/contracts`);
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching contracts");
  }
}

export async function fetchContract(contract: string): Promise<any> {
  try {
    if (!contract) {
      throw new Error("Contract is required");
    }

    const response = await fetch(
      `${mainetBaseUrl}api/v1/contracts/${contract}`
    );
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching contract");
  }
}

export async function fetchContractLogs(contract: string): Promise<any> {
  try {
    if (!contract) {
      throw new Error("Contract is required");
    }

    const response = await fetch(
      `${mainetBaseUrl}api/v1/contracts/${contract}/results/logs`
    );
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching contract logs");
  }
}

// Blocks
export async function fetchBlocks(): Promise<any> {
  try {
    const response = await fetch(`${mainetBaseUrl}api/v1/blocks`);
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching blocks");
  }
}

export async function fetchBlock(block: string): Promise<any> {
  try {
    if (!block) {
      throw new Error("Block is required");
    }

    const response = await fetch(`${mainetBaseUrl}api/v1/blocks/${block}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching block");
  }
}

// Nodes
export async function fetchNodes(): Promise<any> {
  try {
    const response = await fetch(`${mainetBaseUrl}api/v1/network/nodes`);
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching nodes");
  }
}

// Network
export async function fetchNetworkSupply(): Promise<any> {
  try {
    const response = await fetch(`${mainetBaseUrl}api/v1/network/supply`);
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching network");
  }
}

export async function fetchNetworkFees(): Promise<any> {
  try {
    const response = await fetch(`${mainetBaseUrl}api/v1/network/fees`);
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching network fees");
  }
}
