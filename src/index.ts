const mainetBaseUrl = "https://mainnet.mirrornode.hedera.com/";

function errorLog(erros: Error) {
  try {
    console.log(" ");
    console.log(" ");
    console.info(
      "-------------------------Error details-------------------------"
    );
    console.log("Name: ", erros.name);
    console.log("Message: ", erros.message);
    console.log(" ");
    console.log(" ");
    console.log("Error Stack--------------------------");
    console.log(erros.stack);
    console.info(
      "---------------------------------------------------------------"
    );
    console.log(" ");
    console.log(" ");

    throw erros;
  } catch (e) {
    console.log("Ocurrio un error al mostrar el error en consola");
    console.log(e);
  }
}

// Función para reemplazar recursivamente 'ar://' e 'ipfs://' por sus equivalentes HTTPS
function replaceUrls(obj: any): any {
  if (typeof obj === "string") {
    if (obj.startsWith("ar://")) {
      return obj.replace("ar://", "https://arweave.net/");
    }
    if (obj.startsWith("ipfs://")) {
      return obj.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
  } else if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      obj[key] = replaceUrls(obj[key]);
    }
  }
  return obj;
}

//---------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------
//--------------------------------Fetch Data for Polaris Explorer------------------------------------

//Buscar alguna cuenta o cuentas basado en unos x parametros
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
      let e = new Error(
        "Hedera Fetch Error | -> Invalid value for 'lt'. Must be a valid filter."
      );
      errorLog(e);
    }
    if (lte && lte !== "gt" && lte !== "gte" && lte !== "lt" && lte !== "lte") {
      let e = new Error(
        "Hedera Fetch Error | -> Invalid value for 'lte'. Must be a valid filter."
      );
      errorLog(e);
    }
    if (gt && gt !== "gt" && gt !== "gte" && gt !== "lt" && gt !== "lte") {
      let e = new Error(
        "Hedera Fetch Error | -> Invalid value for 'gt'. Must be a valid filter."
      );
      errorLog(e);
    }
    if (gte && gte !== "gt" && gte !== "gte" && gte !== "lt" && gte !== "lte") {
      let e = new Error(
        "Hedera Fetch Error | -> Invalid value for 'gte'. Must be a valid filter."
      );
      errorLog(e);
    }
    if (order && !["asc", "desc"].includes(order)) {
      let e = new Error(
        "Hedera Fetch Error | -> Invalid value for 'order'. Must be 'asc' or 'desc'."
      );
      errorLog(e);
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
          let e = new Error(
            "Hedera Fetch Error | -> Invalid format for 'account.id'. Must be in the format '0.0.<number>'."
          );
          errorLog(e);
        }
        params[`account.id`] = account.id;
      }
      if (account.balance) {
        if (!["gt", "gte", "lt", "lte"].includes(account.balance.op)) {
          let e = new Error(
            "Hedera Fetch Error | -> Invalid operator for 'account.balance'. Must be 'gt', 'gte', 'lt', or 'lte'."
          );
          errorLog(e);
        }
        if (typeof account.balance.value !== "string") {
          let e = new Error(
            "Hedera Fetch Error | -> Invalid value for 'account.balance'. Must be a string."
          );
          errorLog(e);
        }
        params[
          `account.balance`
        ] = `${account.balance.op}:${account.balance.value}`;
      }
      if (account.publickey) {
        if (typeof account.publickey !== "string") {
          let e = new Error(
            "Hedera Fetch Error | -> Invalid format for 'account.publickey'. Must be a string."
          );
          errorLog(e);
        }
        params[`account.publickey`] = account.publickey;
      }
    }

    // Validar parámetro transactionType
    if (transactionType) {
      if (!account || !account.id) {
        let e = new Error(
          "Hedera Fetch Error | -> Account ID is required for 'transactionType'."
        );
        errorLog(e);
      }
      return fetch(
        `${mainetBaseUrl}api/v1/accounts/${account?.id}?transactionType=${transactionType}`,
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

    console.log(" ");
    console.log(" ");
    console.info("Hedera Fetch Info | -> Request URL:", url); // Verifica la URL generada
    console.log(" ");
    console.log(" ");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let e = new Error(
        `Hedera Fetch Error | -> HTTP error! Status: ${response.status}`
      );
      errorLog(e);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(
      "Hedera Fetch Error | -> Error fetching accounts: " + error
    );
  }
}

//Buscar informacion basica de una cuenta
export async function fetchAccount(account: string): Promise<any> {
  try {
    // Si la cuenta no existe, se lanza una excepción
    if (!account) {
      let e = new Error("Hedera Fetch Error | -> Account is required");
      errorLog(e);
    }

    const response = await fetch(`${mainetBaseUrl}api/v1/accounts/${account}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching account data");
  }
}

//Buscar todos los tokens asociados a una cuenta
export async function fetchAccountTokensAsociated(
  account: string
): Promise<any> {
  try {
    // Si la cuenta no existe, se lanza una excepción
    if (!account) {
      let e = new Error("Hedera Fetch Error | -> Account is required");
      errorLog(e);
    }

    const response = await fetch(
      `${mainetBaseUrl}api/v1/accounts/${account}/tokens`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching account tokens associated");
  }
}

//Buscar los nfts que tenga una cuenta, (opcional pasarle parametros para filtrar estos NFTs)
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
      let e = new Error("Hedera Fetch Error | -> Account is required.");
      errorLog(e);
    }

    // Validar y construir los parámetros de consulta
    const params: Record<string, string> = {};

    if (tokenId) {
      if (
        !["eq", "ne", "lt", "lte", "gt", "gte"].includes(
          tokenIdOperator || "eq"
        )
      ) {
        let e = new Error(
          "Hedera Fetch Error | -> Invalid operator for 'tokenId'."
        );
        errorLog(e);
      }
      params[`token.id${tokenIdOperator ? `=${tokenIdOperator}` : ""}`] =
        tokenId;
    }

    if (serialNumber) {
      if (
        !["eq", "lt", "lte", "gt", "gte"].includes(serialNumberOperator || "eq")
      ) {
        let e = new Error(
          "Hedera Fetch Error | -> Invalid operator for 'serialNumber'."
        );
        errorLog(e);
      }
      params[
        `serialnumber${serialNumberOperator ? `=${serialNumberOperator}` : ""}`
      ] = serialNumber;
    }

    if (spenderId) {
      if (!["eq", "lt", "gt"].includes(spenderIdOperator || "eq")) {
        let e = new Error(
          "Hedera Fetch Error | -> Invalid operator for 'spenderId'."
        );
        errorLog(e);
      }
      params[`spender.id${spenderIdOperator ? `=${spenderIdOperator}` : ""}`] =
        spenderId;
    }

    if (!["asc", "desc"].includes(order)) {
      let e = new Error(
        "Hedera Fetch Error | -> Invalid value for 'order'. Must be 'asc' or 'desc'."
      );
      errorLog(e);
    }
    params.order = order;

    // Construir la URL con los parámetros de consulta
    const queryString = new URLSearchParams(params).toString();
    const url = `${mainetBaseUrl}api/v1/accounts/${account}/nfts${
      queryString ? `?${queryString}` : ""
    }`;

    console.log(" ");
    console.log(" ");
    console.log("Hedera Fetch Info | -> Request URL:", url); // Verifica la URL generada
    console.log(" ");
    console.log(" ");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let e = new Error(`HTTP error! Status: ${response.status}`);
      errorLog(e);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching account NFTs:", error);
    throw new Error("Error fetching account NFTs: " + error);
  }
}

//Buscar las recompensas que ha obtenido una cuenta
export async function fetchAccountRewards(account: string): Promise<any> {
  try {
    // Si la cuenta no existe, se lanza una excepción
    if (!account) {
      let e = new Error("Hedera Fetch Error | -> Account is required");
      errorLog(e);
    }

    const response = await fetch(
      `${mainetBaseUrl}api/v1/accounts/${account}/rewards`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching account rewards");
  }
}

//Buscar los balances en (tokens) de una cuenta y opcional filtrar los resultados
export async function fetchBalances({
  accountId,
  accountIdOperator,
  balance,
  balanceOperator,
  timestamp,
  publicKey,
  order = "desc",
}: {
  accountId?: string;
  accountIdOperator?: "eq" | "lt" | "lte" | "gt" | "gte";
  balance?: string;
  balanceOperator?: "eq" | "lt" | "lte" | "gt" | "gte";
  timestamp?: string;
  publicKey?: string;
  order?: "asc" | "desc";
} = {}): Promise<any> {
  try {
    // Validar y construir los parámetros de consulta
    const params: Record<string, string> = {};

    if (accountId) {
      if (
        !["eq", "lt", "lte", "gt", "gte"].includes(accountIdOperator || "eq")
      ) {
        let e = new Error(
          "Hedera Fetch Error | -> Invalid operator for 'accountId'."
        );
        errorLog(e);
      }
      params[`account.id${accountIdOperator ? `=${accountIdOperator}` : ""}`] =
        accountId;
    }

    if (balance) {
      if (!["eq", "lt", "lte", "gt", "gte"].includes(balanceOperator || "eq")) {
        let e = new Error(
          "Hedera Fetch Error | -> Invalid operator for 'balance'."
        );
        errorLog(e);
      }
      params[`account.balance${balanceOperator ? `=${balanceOperator}` : ""}`] =
        balance;
    }

    if (timestamp) {
      if (!/^\d+\.\d{9}$/.test(timestamp)) {
        let e = new Error(
          "Hedera Fetch Error | -> Invalid format for 'timestamp'. Must be in seconds.nanoseconds format."
        );
      }
      params.timestamp = timestamp;
    }

    if (publicKey) {
      if (typeof publicKey !== "string") {
        let e = new Error(
          "Hedera Fetch Error | -> Invalid format for 'publicKey'. Must be a string."
        );
        errorLog(e);
      }
      params["account.publickey"] = publicKey;
    }

    if (!["asc", "desc"].includes(order)) {
      let e = new Error(
        "Hedera Fetch Error | -> Invalid value for 'order'. Must be 'asc' or 'desc'."
      );
      errorLog(e);
    }
    params.order = order;

    // Construir la URL con los parámetros de consulta
    const queryString = new URLSearchParams(params).toString();
    const url = `${mainetBaseUrl}api/v1/balances${
      queryString ? `?${queryString}` : ""
    }`;

    console.log(" ");
    console.log(" ");
    console.log("Hedera Fetch Info | -> Request URL:", url); // Verifica la URL generada
    console.log(" ");
    console.log(" ");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let e = new Error(
        `Hedera Fetch Error | -> HTTP error! Status: ${response.status}`
      );
      errorLog(e);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching balances:", error);
    throw new Error("Error fetching balances: " + error);
  }
}

//Buscar un grupo de transacciones o una transaccion con opcion de filtrado
export async function fetchTransactions({
  accountId,
  accountIdOperator,
  timestamp,
  result,
  transactionType,
  order = "desc",
}: {
  accountId?: string;
  accountIdOperator?: "eq" | "lt" | "lte" | "gt" | "gte";
  timestamp?: string;
  result?: "success" | "fail";
  transactionType?: string;
  order?: "asc" | "desc";
} = {}): Promise<any> {
  try {
    // Validar y construir los parámetros de consulta
    const params: Record<string, string> = {};

    if (accountId) {
      if (
        !["eq", "lt", "lte", "gt", "gte"].includes(accountIdOperator || "eq")
      ) {
        let e = new Error(
          "Hedera Fetch Error | -> Invalid operator for 'accountId'."
        );
        errorLog(e);
      }
      params[`account.id${accountIdOperator ? `=${accountIdOperator}` : ""}`] =
        accountId;
    }

    if (timestamp) {
      if (!/^\d+\.\d{9}$/.test(timestamp)) {
        let e = new Error(
          "Hedera Fetch Error | -> Invalid format for 'timestamp'. Must be in seconds.nanoseconds format."
        );
        errorLog(e);
      }
      params.timestamp = timestamp;
    }

    if (result) {
      if (!["success", "fail"].includes(result)) {
        let e = new Error(
          "Hedera Fetch Error | -> Invalid value for 'result'. Must be 'success' or 'fail'."
        );
        errorLog(e);
      }
      params.result = result;
    }

    if (transactionType) {
      params.transactionType = transactionType;
    }

    if (!["asc", "desc"].includes(order)) {
      let e = new Error(
        "Hedera Fetch Error | -> Invalid value for 'order'. Must be 'asc' or 'desc'."
      );
      errorLog(e);
    }
    params.order = order;

    // Construir la URL con los parámetros de consulta
    const queryString = new URLSearchParams(params).toString();
    const url = `${mainetBaseUrl}api/v1/transactions${
      queryString ? `?${queryString}` : ""
    }`;

    console.log(" ");
    console.log(" ");
    console.log("Hedera Fetch Info | -> Request URL:", url); // Verifica la URL generada
    console.log(" ");
    console.log(" ");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let e = new Error(
        `Hedera Fetch Error | -> HTTP error! Status: ${response.status}`
      );
      errorLog(e);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error("Error fetching transactions: " + error);
  }
}

//Buscar las transacciones que ha realizado una cuenta con opcion de filtrado
export async function fetchTransactionsAccount(
  account: string,
  filters: {
    timestamp?: string;
    result?: "success" | "fail";
    transactionType?: string;
    order?: "asc" | "desc";
  } = {}
): Promise<any> {
  try {
    // Validar la cuenta
    if (!account) {
      let e = new Error("Hedera Fetch Error | -> Account is required");
      errorLog(e);
    }

    if (!account.startsWith("0.0")) {
      let e = new Error("Hedera Fetch Error | -> Account must start with 0.0");
      errorLog(e);
    }

    // Llamar a fetchTransactions con el accountId y filtros
    return await fetchTransactions({
      accountId: account,
      accountIdOperator: "eq", // Buscar solo este ID
      ...filters, // Pasar los otros filtros
    });
  } catch (error) {
    console.error("Error fetching transactions for account:", error);
    throw new Error("Error fetching transactions for account: " + error);
  }
}

//Buscar informacion de un topic en especifico
export async function fetchTopicMessages(topicId: string): Promise<any> {
  try {
    // Validar topicId
    if (!topicId) {
      let e = new Error("Hedera Fetch Error | -> Topic id is required.");
      errorLog(e);
    }

    // Verificar el formato del topicId
    if (!/^0\.0\.\d+$/.test(topicId)) {
      let e = new Error(
        "Hedera Fetch Error | -> Invalid format for 'topicId'. Must be in the format '0.0.<number>'."
      );
      errorLog(e);
    }

    console.log(" ");
    console.log(" ");
    console.log(
      `Hedera Fetch Info | -> Fetch URL: ${mainetBaseUrl}api/v1/topics/${topicId}/messages`
    );
    console.log(" ");
    console.log(" ");

    const response = await fetch(
      `${mainetBaseUrl}api/v1/topics/${topicId}/messages`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching topic messages:", error);
    throw new Error("Error fetching topic messages: " + error);
  }
}

//Buscar el mensage de un topic por la sequencia de numeros
export async function fetchTopicMessageBySequenceNumber(
  topicId: string,
  sequenceNumber: number
): Promise<any> {
  try {
    // Validar topicId
    if (!topicId) {
      let e = new Error("Hedera Fetch Error | -> Topic id is required.");
      errorLog(e);
    }

    // Verificar el formato del topicId
    if (!/^0\.0\.\d+$/.test(topicId)) {
      let e = new Error(
        "Hedera Fetch Error | -> Invalid format for 'topicId'. Must be in the format '0.0.<number>'."
      );
      errorLog(e);
    }

    // Validar sequenceNumber
    if (sequenceNumber <= 0) {
      let e = new Error(
        "Hedera Fetch Error | -> Sequence number must be a positive integer."
      );
      errorLog(e);
    }

    const response = await fetch(
      `${mainetBaseUrl}api/v1/topics/${topicId}/messages/${sequenceNumber}`
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching topic message by sequence number:", error);
    throw new Error(
      "Error fetching topic message by sequence number: " + error
    );
  }
}

//Buscar un mensage de un topic por su timestamp
export async function fetchTopicMessageByTimestamp(
  timestamp: string
): Promise<any> {
  try {
    // Validar timestamp
    if (!timestamp) {
      let e = new Error(
        "Hedera Fetch Error | -> Consensus timestamp is required."
      );
      errorLog(e);
    }

    // Verificar formato del timestamp (seconds.nanoseconds)
    if (!/^\d+\.\d{9}$/.test(timestamp)) {
      let e = new Error(
        "Hedera Fetch Error | -> Invalid format for 'timestamp'. Must be in the format 'seconds.nanoseconds'."
      );
      errorLog(e);
    }

    const response = await fetch(
      `${mainetBaseUrl}api/v1/topics/messages/${timestamp}`
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching topic message by timestamp:", error);
    throw new Error("Error fetching topic message by timestamp: " + error);
  }
}

//Buscar un grupo de tokens o un token en especifico con posibilidad de filtrado
export async function fetchTokens({
  publicKey,
  accountId,
  tokenId,
  tokenIdOperator,
  order = "desc",
  limit,
}: {
  publicKey?: string;
  accountId?: string;
  tokenId?: string;
  tokenIdOperator?: "eq" | "lt" | "lte" | "gt" | "gte";
  order?: "asc" | "desc";
  limit?: number;
} = {}): Promise<any> {
  try {
    // Validar y construir los parámetros de consulta
    const params: Record<string, string> = {};

    if (publicKey) {
      params.publickey = publicKey;
    }

    if (accountId) {
      if (!/^0\.0\.\d+$/.test(accountId)) {
        let e = new Error(
          "Hedera Fetch Error | -> Invalid format for 'accountId'. Must be in the format '0.0.<number>'."
        );
        errorLog(e);
      }
      params["account.id"] = accountId;
    }

    if (tokenId) {
      if (!["eq", "lt", "lte", "gt", "gte"].includes(tokenIdOperator || "eq")) {
        let e = new Error(
          "Hedera Fetch Error | -> Invalid operator for 'tokenId'."
        );
        errorLog(e);
      }
      params[`token.id${tokenIdOperator ? `=${tokenIdOperator}` : ""}`] =
        tokenId;
    }

    if (!["asc", "desc"].includes(order)) {
      let e = new Error(
        "Hedera Fetch Error | -> Invalid value for 'order'. Must be 'asc' or 'desc'."
      );
      errorLog(e);
    }
    params.order = order;

    if (limit) {
      if (limit <= 0) {
        let e = new Error(
          "Hedera Fetch Error | -> Limit must be a positive number."
        );
        errorLog(e);
      }
      params.limit = limit.toString();
    }

    // Construir la URL con los parámetros de consulta
    const queryString = new URLSearchParams(params).toString();
    const url = `${mainetBaseUrl}api/v1/tokens${
      queryString ? `?${queryString}` : ""
    }`;

    console.log(" ");
    console.log(" ");
    console.log("Hedera Fetch Info | -> Request URL:", url); // Verifica la URL generada
    console.log(" ");
    console.log(" ");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let e = new Error(
        `Hedera Fetch Error | -> HTTP error! Status: ${response.status}`
      );
      errorLog(e);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tokens:", error);
    throw new Error("Error fetching tokens: " + error);
  }
}

// Función para buscar información sobre un token especifico
export async function fetchToken(tokenId: string): Promise<any> {
  try {
    // Validar el tokenId
    if (!tokenId) {
      let e = new Error("Hedera Fetch Error | -> Token ID is required.");
      errorLog(e);
    }

    // Verificar el formato del tokenId
    if (!/^0\.0\.\d+$/.test(tokenId)) {
      let e = new Error(
        "Hedera Fetch Error | -> Invalid format for 'tokenId'. Must be in the format '0.0.<number>'."
      );
      errorLog(e);
    }

    // Endpoint para obtener información del token (colección NFT)
    const url = `${mainetBaseUrl}api/v1/tokens/${tokenId}`;

    console.info("Hedera Fetch Info | -> Request URL:", url);

    // Realizar la petición GET
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let e = new Error(
        `Hedera Fetch Error | -> HTTP error! Status: ${response.status}`
      );
      errorLog(e);
    }

    // Convertir la respuesta a JSON
    const data = await response.json();

    // Decodificar el campo 'metadata' de Base64 a texto
    if (data.metadata) {
      try {
        const decodedMetadata = Buffer.from(data.metadata, "base64").toString(
          "utf-8"
        );
        data.decodedMetadata = decodedMetadata;

        // Si la metadata contiene una URL con el esquema 'ar://', convertirla a HTTPS
        if (decodedMetadata.startsWith("ar://")) {
          const arweaveUrl = decodedMetadata.replace(
            "ar://",
            "https://arweave.net/"
          );
          console.log("Fetching data from Arweave URL:", arweaveUrl);

          const arweaveResponse = await fetch(arweaveUrl);
          if (!arweaveResponse.ok) {
            let e = new Error(
              `Arweave Fetch Error | -> HTTP error! Status: ${arweaveResponse.status}`
            );
            errorLog(e);
          }

          // Obtener los datos de la URL de Arweave y añadirlos al objeto
          const arweaveData = await arweaveResponse.json();

          // Reemplazar recursivamente 'ar://' e 'ipfs://' por sus equivalentes HTTPS
          data.arweaveMetadata = replaceUrls(arweaveData);
        }
      } catch (decodeError) {
        console.error("Error decoding metadata:", decodeError);
        data.decodedMetadata = null;
      }
    } else {
      data.decodedMetadata = null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching NFT collection:", error);
    throw new Error("Error fetching NFT collection: " + error);
  }
}

//Buscar los balances de un token especifico que pueda tener una wallet con opcion de filtrado
export async function fetchTokenBalances(
  tokenId: string,
  {
    accountId,
    accountIdOperator,
    accountBalance,
    accountBalanceOperator,
    timestamp,
    order = "desc",
  }: {
    accountId?: string;
    accountIdOperator?: "eq" | "lt" | "lte" | "gt" | "gte";
    accountBalance?: string;
    accountBalanceOperator?: "eq" | "lt" | "lte" | "gt" | "gte";
    timestamp?: string;
    order?: "asc" | "desc";
  } = {}
): Promise<any> {
  try {
    // Validar tokenId
    if (!tokenId) {
      let e = new Error("Hedera Fetch Error | -> Token id is required.");
      errorLog(e);
    }

    // Validar y construir los parámetros de consulta
    const params: Record<string, string> = {};

    if (accountId) {
      if (!/^0\.0\.\d+$/.test(accountId)) {
        let e = new Error(
          "Hedera Fetch Error | -> Invalid format for 'accountId'. Must be in the format '0.0.<number>'."
        );
        errorLog(e);
      }
      params[`account.id${accountIdOperator ? `=${accountIdOperator}` : ""}`] =
        accountId;
    }

    if (accountBalance) {
      if (
        !["eq", "lt", "lte", "gt", "gte"].includes(
          accountBalanceOperator || "eq"
        )
      ) {
        let e = new Error(
          "Hedera Fetch Error | -> Invalid operator for 'accountBalance'."
        );
        errorLog(e);
      }
      params[
        `account.balance${
          accountBalanceOperator ? `=${accountBalanceOperator}` : ""
        }`
      ] = accountBalance;
    }

    if (timestamp) {
      if (!/^\d+\.\d{9}$/.test(timestamp)) {
        let e = new Error(
          "Hedera Fetch Error | -> Invalid format for 'timestamp'. Must be in the format 'seconds.nanoseconds'."
        );
        errorLog(e);
      }
      params.timestamp = timestamp;
    }

    if (!["asc", "desc"].includes(order)) {
      let e = new Error(
        "Hedera Fetch Error | -> Invalid value for 'order'. Must be 'asc' or 'desc'."
      );
      errorLog(e);
    }
    params.order = order;

    // Construir la URL con los parámetros de consulta
    const queryString = new URLSearchParams(params).toString();
    const url = `${mainetBaseUrl}api/v1/tokens/${tokenId}/balances${
      queryString ? `?${queryString}` : ""
    }`;

    console.log(" ");
    console.log(" ");
    console.log("Hedera Fetch Info | -> Request URL:", url); // Verifica la URL generada
    console.log(" ");
    console.log(" ");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let e = new Error(
        `Hedera Fetch Error | -> HTTP error! Status: ${response.status}`
      );
      errorLog(e);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching token balances:", error);
    throw new Error("Error fetching token balances: " + error);
  }
}

//Buscar los NFTs que pueda tener una x Wallet con opcion de filtrado
export async function fetchTokenNfts(
  tokenId: string,
  {
    accountId,
    limit,
    order = "desc",
    serialNumber,
  }: {
    accountId?: string;
    limit?: number;
    order?: "asc" | "desc";
    serialNumber?: string;
  } = {}
): Promise<any> {
  try {
    // Validar tokenId
    if (!tokenId) {
      let e = new Error("Hedera Fetch Error | -> Token id is required.");
      errorLog(e);
    }

    // Validar y construir los parámetros de consulta
    const params: Record<string, string> = {};

    if (accountId) {
      if (!/^0\.0\.\d+$/.test(accountId)) {
        let e = new Error(
          "Hedera Fetch Error | -> Invalid format for 'accountId'. Must be in the format '0.0.<number>'."
        );
        errorLog(e);
      }
      params["account.id"] = accountId;
    }

    if (limit) {
      if (limit <= 0) {
        let e = new Error(
          "Hedera Fetch Error | -> Limit must be a positive number."
        );
        errorLog(e);
      }
      params.limit = limit.toString();
    }

    if (serialNumber) {
      params.serialnumber = serialNumber;
    }

    if (!["asc", "desc"].includes(order)) {
      let e = new Error(
        "Hedera Fetch Error | -> Invalid value for 'order'. Must be 'asc' or 'desc'."
      );
      errorLog(e);
    }
    params.order = order;

    // Construir la URL con los parámetros de consulta
    const queryString = new URLSearchParams(params).toString();
    const url = `${mainetBaseUrl}api/v1/tokens/${tokenId}/nfts${
      queryString ? `?${queryString}` : ""
    }`;

    console.log(" ");
    console.log(" ");
    console.log("Hedera Fetch Info | -> Request URL:", url); // Verifica la URL generada
    console.log(" ");
    console.log(" ");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let e = new Error(
        `Hedera Fetch Error | -> HTTP error! Status: ${response.status}`
      );
      errorLog(e);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching token NFTs:", error);
    throw new Error("Error fetching token NFTs: " + error);
  }
}

//Buscar un NFT en especifico por su numero serial
export async function fetchTokenNftSerialNumber(
  tokenId: string,
  serialNumber: string
): Promise<any> {
  try {
    if (!tokenId) {
      let e = new Error("Hedera Fetch Error | -> Token id is required");
      errorLog(e);
    }

    if (!serialNumber) {
      let e = new Error("Hedera Fetch Error | -> Serial number is required");
      errorLog(e);
    }

    const response = await fetch(
      `${mainetBaseUrl}api/v1/tokens/${tokenId}/nfts/${serialNumber}`
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching token serial number");
  }
}

//Buscar el historial de transacciones de un NFT especifico
export async function fetchNftTransactionHistory(
  tokenID: string,
  serialNumber: string,
  {
    limit,
    order = "desc",
    timestamp,
  }: {
    limit?: number;
    order?: "asc" | "desc";
    timestamp?: string;
  } = {}
): Promise<any> {
  try {
    // Validar tokenID y serialNumber
    if (!tokenID) {
      let e = new Error("Hedera Fetch Error | -> Nft id is required.");
      errorLog(e);
    }

    if (!/^0\.0\.\d+$/.test(tokenID)) {
      let e = new Error(
        "Hedera Fetch Error | -> Invalid format for 'tokenID'. Must be in the format '0.0.<number>'."
      );
      errorLog(e);
    }

    if (!serialNumber) {
      let e = new Error("Hedera Fetch Error | -> Serial number is required.");
      errorLog(e);
    }

    // Validar y construir los parámetros de consulta
    const params: Record<string, string> = {};

    if (limit) {
      if (limit <= 0) {
        let e = new Error(
          "Hedera Fetch Error | -> Limit must be a positive number."
        );
        errorLog(e);
      }
      params.limit = limit.toString();
    }

    if (!["asc", "desc"].includes(order)) {
      let e = new Error(
        "Hedera Fetch Error | -> Invalid value for 'order'. Must be 'asc' or 'desc'."
      );
      errorLog(e);
    }
    params.order = order;

    if (timestamp) {
      if (!/^\d+\.\d{9}$/.test(timestamp)) {
        let e = new Error(
          "Hedera Fetch Error | -> Invalid format for 'timestamp'. Must be in the format 'seconds.nanoseconds'."
        );
        errorLog(e);
      }
      params.timestamp = timestamp;
    }

    // Construir la URL con los parámetros de consulta
    const queryString = new URLSearchParams(params).toString();
    const url = `${mainetBaseUrl}api/v1/tokens/${tokenID}/nfts/${serialNumber}/transactions${
      queryString ? `?${queryString}` : ""
    }`;

    console.log(" ");
    console.log(" ");
    console.log("Hedera Fetch Info | -> Request URL:", url); // Verifica la URL generada
    console.log(" ");
    console.log(" ");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let e = new Error(
        `Hedera Fetch Error | -> HTTP error! Status: ${response.status}`
      );
      errorLog(e);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching NFT transaction history:", error);
    throw new Error("Error fetching NFT transaction history: " + error);
  }
}

//Buscar un x numero de contratos o unos en especifico con opcion de filtrado
export async function fetchContracts({
  contractId,
  limit,
  order = "desc",
}: {
  contractId?: string;
  limit?: number;
  order?: "asc" | "desc";
} = {}): Promise<any> {
  try {
    // Validar y construir los parámetros de consulta
    const params: Record<string, string> = {};

    if (contractId) {
      if (!/^0\.0\.\d+$/.test(contractId)) {
        let e = new Error(
          "Hedera Fetch Error | -> Invalid format for 'contractId'. Must be in the format '0.0.<number>'."
        );
        errorLog(e);
      }
      params["contract.id"] = contractId;
    }

    if (limit) {
      if (limit <= 0) {
        let e = new Error(
          "Hedera Fetch Error | -> Limit must be a positive number."
        );
        errorLog(e);
      }
      params.limit = limit.toString();
    }

    if (!["asc", "desc"].includes(order)) {
      let e = new Error(
        "Hedera Fetch Error | -> Invalid value for 'order'. Must be 'asc' or 'desc'."
      );
      errorLog(e);
    }
    params.order = order;

    // Construir la URL con los parámetros de consulta
    const queryString = new URLSearchParams(params).toString();
    const url = `${mainetBaseUrl}api/v1/contracts${
      queryString ? `?${queryString}` : ""
    }`;

    console.log(" ");
    console.log(" ");
    console.log("Hedera Fetch Info | -> Request URL:", url); // Verifica la URL generada
    console.log(" ");
    console.log(" ");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let e = new Error(
        `Hedera Fetch Error | -> HTTP error! Status: ${response.status}`
      );
      errorLog(e);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching contracts:", error);
    throw new Error("Error fetching contracts: " + error);
  }
}

//Buscar informacion de un contrato especifico
export async function fetchContract(contract: string): Promise<any> {
  try {
    if (!contract) {
      let e = new Error("Hedera Fetch Error | -> Contract is required");
      errorLog(e);
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

//Buscar los logs de un contrato especifico
export async function fetchContractLogs(contract: string): Promise<any> {
  try {
    if (!contract) {
      let e = new Error("Hedera Fetch Error | -> Contract is required");
      errorLog(e);
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

//Buscar informacion de los ultimos bloques
export async function fetchBlocks(): Promise<any> {
  try {
    const response = await fetch(`${mainetBaseUrl}api/v1/blocks`);
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching blocks");
  }
}

//Buscar informacion de un bloquee especifico
export async function fetchBlock(block: string): Promise<any> {
  try {
    if (!block) {
      let e = new Error("Hedera Fetch Error | -> Block is required");
      errorLog(e);
    }

    const response = await fetch(`${mainetBaseUrl}api/v1/blocks/${block}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching block");
  }
}

//Buscar informacion sobre los ultimos nodos
export async function fetchNodes(): Promise<any> {
  try {
    const response = await fetch(`${mainetBaseUrl}api/v1/network/nodes`);
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching nodes");
  }
}

//Buscar informacion del supply actual en la red (hbar)
export async function fetchNetworkSupply(): Promise<any> {
  try {
    const response = await fetch(`${mainetBaseUrl}api/v1/network/supply`);
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching network");
  }
}

//Buscar informacion de los fees actuales en la red
export async function fetchNetworkFees(): Promise<any> {
  try {
    const response = await fetch(`${mainetBaseUrl}api/v1/network/fees`);
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching network fees");
  }
}
