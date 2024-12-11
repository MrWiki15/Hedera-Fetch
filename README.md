# Hedera Fetch Library

`hedera-fetch` is a library designed to retrieve information from the Hedera blockchain network. It provides flexible methods to query accounts, tokens, NFTs, contracts, transactions, and other network-related data. The library supports a variety of filters to help refine the results.

# Features

- Fetch details about accounts, tokens, NFTs, contracts, and network data.
- Retrieve specific transactions and apply filters for precise queries.
- Get metadata and balances for tokens or accounts.
- Query the current state of the network, including fees and supply.

# Installation

To install the library, use npm:

npm install hedera-fetch

# Parameters Explained

## General Parameters

- **`accountId`**: The Hedera account ID in the format `0.0.xxxxx`.
- **`tokenId`**: The Hedera token ID in the format `0.0.xxxxx`.
- **`contractId`**: The Hedera contract ID in the format `0.0.xxxxx`.
- **`order`**: The order of the results, either `"asc"` (ascending) or `"desc"` (descending).
- **`limit`**: The maximum number of results to return (must be a positive integer).
- **`timestamp`**: A timestamp in the `seconds.nanoseconds` format.

## Filtering Parameters

- **`accountIdOperator` / `tokenIdOperator`**: Operators for filtering (`"eq"`, `"lt"`, `"lte"`, `"gt"`, `"gte"`).
- **`balanceOperator` / `serialNumberOperator`**: Similar operators used for filtering balances or NFT serial numbers.

## NFT-Specific Parameters

- **`serialNumber`**: The unique serial number of an NFT.
- **`spenderId`**: The ID of a spender related to an NFT.

## Additional Parameters

- **`publicKey`**: The public key string associated with an account or token.
- **`result`**: Transaction result (`"success"` or `"fail"`).
- **`transactionType`**: The type of transaction (e.g., `CRYPTO_TRANSFER`).

## Error Handling

All functions log errors using the `errorLog` function, providing detailed information about the issue, such as error name, message, and stack trace. Errors are thrown after logging, allowing users to handle them as needed.

# Usage

Below are examples demonstrating the use of various functions provided by `hedera-fetch`.

## Fetch Account Details

Retrieve details of a specific account:

import { fetchAccount } from 'hedera-fetch';

(async () => {
const accountDetails = await fetchAccount('0.0.xxxxx');
console.log(accountDetails);
})();

## Fetch Tokens Associated with an Account

import { fetchAccountTokensAsociated } from 'hedera-fetch';

(async () => {
const tokens = await fetchAccountTokensAsociated('0.0.xxxxx');
console.log(tokens);
})();

## Fetch NFT Details

Retrieve NFTs owned by an account:

import { fetchAccountNFTs } from 'hedera-fetch';

(async () => {
const nfts = await fetchAccountNFTs('0.0.xxxxx');
console.log(nfts);
})();

## Fetch Token Information

Retrieve metadata and details of a specific token:

import { fetchToken } from 'hedera-fetch';

(async () => {
const tokenDetails = await fetchToken('0.0.xxxxx');
console.log(tokenDetails);
})();

## Fetch Transactions

Retrieve transactions with filtering options:

import { fetchTransactions } from 'hedera-fetch';

(async () => {
const transactions = await fetchTransactions({
accountId: '0.0.xxxxx',
order: 'desc',
});
console.log(transactions);
})();

## Fetch Network Information

Get details about the current network supply and fees:

import { fetchNetworkSupply, fetchNetworkFees } from 'hedera-fetch';

(async () => {
const supply = await fetchNetworkSupply();
const fees = await fetchNetworkFees();
console.log({ supply, fees });
})();
