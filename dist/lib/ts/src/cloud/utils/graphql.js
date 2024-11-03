"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountFromGraphQL = exports.getBalanceFromGraphQL = exports.defaultToken = void 0;
exports.defaultToken = "wSHV2S4qX9jFsLjQo8r1BsMLH2ZRKsZx6EJd1sbozGPieEC4Jf";
async function getBalanceFromGraphQL(params) {
    const { publicKey, mina } = params;
    const tokenId = params.tokenId ?? exports.defaultToken;
    if (mina.length === 0)
        throw new Error("no mina endpoints provided");
    const account = await fetchAccountInternal({
        publicKey,
        tokenId,
        mina,
        queryType: "balance",
    });
    //console.log("getBalanceFromGraphQL account:", account);
    const balance = account?.account?.balance?.total;
    return balance ? BigInt(balance) : 0n;
}
exports.getBalanceFromGraphQL = getBalanceFromGraphQL;
async function getAccountFromGraphQL(params) {
    const { publicKey, mina } = params;
    const tokenId = params.tokenId ?? exports.defaultToken;
    if (mina.length === 0)
        throw new Error("no mina endpoints provided");
    const account = await fetchAccountInternal({
        publicKey,
        tokenId,
        mina,
        queryType: "account",
    });
    return account?.account;
}
exports.getAccountFromGraphQL = getAccountFromGraphQL;
async function fetchAccountInternal(params) {
    const { publicKey, tokenId, mina, timeout, queryType } = params;
    const query = queryType === "balance"
        ? balanceQuery(publicKey, tokenId)
        : accountQuery(publicKey, tokenId);
    let [response, error] = await makeGraphqlRequest({
        query,
        mina,
        timeout,
    });
    if (error !== undefined)
        return { account: undefined, error };
    const account = response?.data?.account;
    if (!account) {
        return {
            account: undefined,
            error: {
                statusCode: 404,
                statusText: `fetchAccount: Account with public key ${publicKey} does not exist.`,
            },
        };
    }
    return {
        account,
        error: undefined,
    };
}
async function makeGraphqlRequest(params) {
    const defaultTimeout = 5 * 60 * 1000; // 5 minutes
    const timeout = params.timeout ?? defaultTimeout;
    const { query, mina } = params;
    const graphqlEndpoint = mina[0];
    const fallbackEndpoints = mina.slice(1);
    if (graphqlEndpoint === "none")
        throw Error("Should have made a graphql request, but don't know to which endpoint.");
    let timeouts = [];
    const clearTimeouts = () => {
        timeouts.forEach((t) => clearTimeout(t));
        timeouts = [];
    };
    const makeRequest = async (url) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);
        timeouts.push(timer);
        let body = JSON.stringify({
            operationName: null,
            query,
            variables: {},
        });
        try {
            let response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body,
                signal: controller.signal,
            });
            return checkResponseStatus(response);
        }
        finally {
            clearTimeouts();
        }
    };
    // try to fetch from endpoints in pairs
    let timeoutErrors = [];
    let urls = [graphqlEndpoint, ...fallbackEndpoints];
    for (let i = 0; i < urls.length; i += 2) {
        let url1 = urls[i];
        let url2 = urls[i + 1];
        if (url2 === undefined) {
            try {
                return await makeRequest(url1);
            }
            catch (error) {
                return [undefined, inferError(error)];
            }
        }
        try {
            return await Promise.race([makeRequest(url1), makeRequest(url2)]);
        }
        catch (unknownError) {
            let error = inferError(unknownError);
            if (error.statusCode === 408) {
                // If the request timed out, try the next 2 endpoints
                timeoutErrors.push({ url1, url2, error });
            }
            else {
                // If the request failed for some other reason (e.g. o1js error), return the error
                return [undefined, error];
            }
        }
    }
    const statusText = timeoutErrors
        .map(({ url1, url2, error }) => `Request to ${url1} and ${url2} timed out. Error: ${error}`)
        .join("\n");
    return [undefined, { statusCode: 408, statusText }];
}
function inferError(error) {
    let errorMessage = JSON.stringify(error);
    if (error instanceof AbortSignal) {
        return { statusCode: 408, statusText: `Request Timeout: ${errorMessage}` };
    }
    else {
        return {
            statusCode: 500,
            statusText: `Unknown Error: ${errorMessage}`,
        };
    }
}
async function checkResponseStatus(response) {
    if (response.ok) {
        const jsonResponse = (await response.json());
        if (jsonResponse.errors && jsonResponse.errors.length > 0) {
            return [
                undefined,
                {
                    statusCode: response.status,
                    statusText: jsonResponse.errors
                        .map((error) => error.message)
                        .join("\n"),
                },
            ];
        }
        else if (jsonResponse.data === undefined) {
            return [
                undefined,
                {
                    statusCode: response.status,
                    statusText: `GraphQL response data is undefined`,
                },
            ];
        }
        return [jsonResponse, undefined];
    }
    else {
        return [
            undefined,
            {
                statusCode: response.status,
                statusText: response.statusText,
            },
        ];
    }
}
const balanceQuery = (publicKey, tokenId) => `{
  account(publicKey: "${publicKey}", token: "${tokenId}") {
    balance { total }
  }
}
`;
const accountQuery = (publicKey, tokenId) => `{
  account(publicKey: "${publicKey}", token: "${tokenId}") {
    publicKey
    token
    nonce
    balance { total }
    tokenSymbol
    receiptChainHash
    timing {
      initialMinimumBalance
      cliffTime
      cliffAmount
      vestingPeriod
      vestingIncrement
    }
    permissions {
      editState
      access
      send
      receive
      setDelegate
      setPermissions
      setVerificationKey {
        auth
        txnVersion
      }
      setZkappUri
      editActionState
      setTokenSymbol
      incrementNonce
      setVotingFor
      setTiming
    }
    delegateAccount { publicKey }
    votingFor
    zkappState
    verificationKey {
      verificationKey
      hash
    }
    actionState
    provedState
    zkappUri
  }
}
`;
