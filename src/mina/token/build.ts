import { Whitelist, WhitelistedAddressList } from "./whitelist.js";
import { FungibleTokenTransactionType } from "./api.js";
import { blockchain } from "../../cloud/networks.js";
import { fetchMinaAccount } from "../utils/fetch.js";
import { accountBalanceMina } from "../utils/mina.js";
import {
  FungibleToken,
  WhitelistedFungibleToken,
  FungibleTokenAdmin,
  FungibleTokenWhitelistedAdmin,
  FungibleTokenOfferContract,
  FungibleTokenBidContract,
  tokenVerificationKeys,
} from "./token.js";
import {
  PublicKey,
  Mina,
  AccountUpdate,
  UInt64,
  UInt8,
  Bool,
  Transaction,
  Struct,
  VerificationKey,
  Field,
} from "o1js";

export async function buildTokenDeployTransaction(params: {
  chain: blockchain;
  fee: UInt64;
  sender: PublicKey;
  nonce: number;
  tokenAddress: PublicKey;
  adminContractAddress: PublicKey;
  adminAddress: PublicKey;
  uri: string;
  symbol: string;
  memo?: string;
  whitelist?: WhitelistedAddressList | string;
  developerAddress?: PublicKey;
  developerFee?: UInt64;
  provingKey: PublicKey;
  provingFee: UInt64;
  decimals: UInt8;
}): Promise<{
  tx: Transaction<false, false>;
  isWhitelisted: boolean;
  adminVerificationKey: VerificationKey;
  tokenVerificationKey: VerificationKey;
  whitelist: string | undefined;
}> {
  const {
    fee,
    sender,
    nonce,
    memo,
    tokenAddress,
    adminContractAddress,
    uri,
    symbol,
    developerAddress,
    developerFee,
    provingKey,
    provingFee,
    decimals,
    chain,
  } = params;
  const isWhitelisted = params.whitelist !== undefined;
  if (memo && typeof memo !== "string")
    throw new Error("Memo must be a string");
  if (memo && memo.length > 30)
    throw new Error("Memo must be less than 30 characters");
  if (!symbol || typeof symbol !== "string")
    throw new Error("Symbol must be a string");
  if (symbol.length >= 7)
    throw new Error("Symbol must be less than 7 characters");

  const adminContract = isWhitelisted
    ? FungibleTokenWhitelistedAdmin
    : FungibleTokenAdmin;
  const tokenContract = isWhitelisted
    ? WhitelistedFungibleToken
    : FungibleToken;
  const vk =
    tokenVerificationKeys[chain === "mainnet" ? "mainnet" : "testnet"].vk;
  if (
    !vk ||
    !vk.FungibleTokenWhitelistedAdmin ||
    !vk.FungibleTokenWhitelistedAdmin.hash ||
    !vk.FungibleTokenWhitelistedAdmin.data ||
    !vk.FungibleTokenAdmin ||
    !vk.FungibleTokenAdmin.hash ||
    !vk.FungibleTokenAdmin.data ||
    !vk.WhitelistedFungibleToken ||
    !vk.WhitelistedFungibleToken.hash ||
    !vk.WhitelistedFungibleToken.data ||
    !vk.FungibleToken ||
    !vk.FungibleToken.hash ||
    !vk.FungibleToken.data
  )
    throw new Error("Cannot get verification keys");
  const adminVerificationKey = isWhitelisted
    ? vk.FungibleTokenWhitelistedAdmin
    : vk.FungibleTokenAdmin;
  const tokenVerificationKey = isWhitelisted
    ? vk.WhitelistedFungibleToken
    : vk.FungibleToken;

  if (!adminVerificationKey || !tokenVerificationKey)
    throw new Error("Cannot get verification keys");
  await fetchMinaAccount({
    publicKey: sender,
    force: true,
  });

  if (!Mina.hasAccount(sender)) {
    throw new Error("Sender does not have account");
  }

  console.log("Sender balance:", await accountBalanceMina(sender));
  const whitelist = params.whitelist
    ? typeof params.whitelist === "string"
      ? Whitelist.fromString(params.whitelist)
      : await Whitelist.create({ list: params.whitelist, name: symbol })
    : undefined;

  const zkToken = new tokenContract(tokenAddress);
  const zkAdmin = new adminContract(adminContractAddress);

  const tx = await Mina.transaction(
    { sender, fee, memo: memo ?? `deploy ${symbol}`, nonce },
    async () => {
      const feeAccountUpdate = AccountUpdate.createSigned(sender);
      feeAccountUpdate.balance.subInPlace(3_000_000_000);
      feeAccountUpdate.send({
        to: provingKey,
        amount: provingFee,
      });
      if (developerAddress && developerFee) {
        feeAccountUpdate.send({
          to: developerAddress,
          amount: developerFee,
        });
      }
      if (isWhitelisted && !whitelist) {
        throw new Error("Whitelisted addresses not found");
      }
      await zkAdmin.deploy({
        adminPublicKey: sender,
        verificationKey: adminVerificationKey,
        whitelist: whitelist!,
      });
      zkAdmin.account.zkappUri.set(uri);
      await zkToken.deploy({
        symbol,
        src: uri,
        verificationKey: tokenVerificationKey,
      });
      await zkToken.initialize(
        adminContractAddress,
        decimals,
        // We can set `startPaused` to `Bool(false)` here, because we are doing an atomic deployment
        // If you are not deploying the admin and token contracts in the same transaction,
        // it is safer to start the tokens paused, and resume them only after verifying that
        // the admin contract has been deployed
        Bool(false)
      );
    }
  );
  return {
    tx,
    isWhitelisted,
    adminVerificationKey: {
      hash: Field(adminVerificationKey.hash),
      data: adminVerificationKey.data,
    },
    tokenVerificationKey: {
      hash: Field(tokenVerificationKey.hash),
      data: tokenVerificationKey.data,
    },
    whitelist: whitelist?.toString(),
  };
}

export async function buildTokenTransaction(params: {
  txType: FungibleTokenTransactionType;
  chain: blockchain;
  fee: UInt64;
  nonce: number;
  memo?: string;
  tokenAddress: PublicKey;
  from: PublicKey;
  to: PublicKey;
  amount?: UInt64;
  price?: UInt64;
  whitelist?: WhitelistedAddressList | string;
  developerAddress?: PublicKey;
  developerFee?: UInt64;
  provingKey: PublicKey;
  provingFee: UInt64;
}): Promise<{
  tx: Transaction<false, false>;
  isWhitelisted: boolean;
  adminContractAddress: PublicKey;
  adminAddress: PublicKey;
  symbol: string;
  adminVerificationKey: VerificationKey;
  tokenVerificationKey: VerificationKey;
  offerVerificationKey: VerificationKey;
  bidVerificationKey: VerificationKey;
  whitelist: string | undefined;
}> {
  const {
    txType,
    chain,
    fee,
    nonce,
    tokenAddress,
    from,
    to,
    amount,
    price,
    developerAddress,
    developerFee,
    provingKey,
    provingFee,
  } = params;
  console.log(txType, "tx for", tokenAddress.toBase58());

  let sender = from;
  // if (
  //   txType === "offer" ||
  //   txType === "bid" || // direction is money direction as no token is moving
  //   txType === "mint" ||
  //   txType === "transfer" ||
  //   txType === "sell" ||
  //   txType === "whitelistOffer" ||
  //   txType === "whitelistBid"
  // ) {
  //   if (sender.toBase58() != from.toBase58()) throw new Error("Invalid sender");
  // }
  if (
    txType === "buy" ||
    txType === "withdrawOffer" ||
    txType === "withdrawBid" // direction is money direction as no token is moving
  ) {
    sender = to;
  }
  console.log("Sender:", sender.toBase58());

  await fetchMinaAccount({
    publicKey: sender,
    force: true,
  });

  if (!Mina.hasAccount(sender)) {
    console.error("Sender does not have account");
    throw new Error("Sender does not have account");
  }

  const { symbol, adminContractAddress, adminAddress, isWhitelisted } =
    await getTokenSymbolAndAdmin({
      tokenAddress,
      chain,
    });
  const memo = params.memo ?? `${txType} ${symbol}`;

  const whitelistedAdminContract = new FungibleTokenWhitelistedAdmin(
    adminContractAddress
  );
  const tokenContract = isWhitelisted
    ? WhitelistedFungibleToken
    : FungibleToken;

  if (
    (txType === "whitelistAdmin" ||
      txType === "whitelistBid" ||
      txType === "whitelistOffer") &&
    !params.whitelist
  ) {
    throw new Error("Whitelist is required");
  }

  const whitelist = params.whitelist
    ? typeof params.whitelist === "string"
      ? Whitelist.fromString(params.whitelist)
      : await Whitelist.create({ list: params.whitelist, name: symbol })
    : undefined;

  const zkToken = new tokenContract(tokenAddress);
  const tokenId = zkToken.deriveTokenId();

  if (txType === "mint" && adminAddress.toBase58() !== sender.toBase58())
    throw new Error("Invalid sender for mint");

  await fetchMinaAccount({
    publicKey: tokenAddress,
    tokenId,
    force: true,
  });
  await fetchMinaAccount({
    publicKey: from,
    tokenId,
    force: (
      [
        "offer",
        "whitelistOffer",
        "bid",
        "whitelistBid",
        "sell",
        "transfer",
        "withdrawOffer",
      ] satisfies FungibleTokenTransactionType[] as FungibleTokenTransactionType[]
    ).includes(txType),
  });

  await fetchMinaAccount({
    publicKey: to,
    tokenId,
    force: (
      [
        "sell",
        "whitelistAdmin",
        "withdrawBid",
        "withdrawOffer",
      ] satisfies FungibleTokenTransactionType[] as FungibleTokenTransactionType[]
    ).includes(txType),
  });

  const isNewAccount = Mina.hasAccount(to, tokenId) === false;
  const offerContract = new FungibleTokenOfferContract(
    (
      [
        "offer",
        "whitelistOffer",
      ] satisfies FungibleTokenTransactionType[] as FungibleTokenTransactionType[]
    ).includes(txType)
      ? to
      : from,
    tokenId
  );
  const bidContract = new FungibleTokenBidContract(
    (
      [
        "bid",
        "whitelistBid",
      ] satisfies FungibleTokenTransactionType[] as FungibleTokenTransactionType[]
    ).includes(txType)
      ? from
      : to,
    tokenId
  );
  const offerContractDeployment = new FungibleTokenOfferContract(to, tokenId);
  const bidContractDeployment = new FungibleTokenBidContract(from, tokenId);
  const vk =
    tokenVerificationKeys[chain === "mainnet" ? "mainnet" : "testnet"].vk;
  if (
    !vk ||
    !vk.FungibleTokenOfferContract ||
    !vk.FungibleTokenOfferContract.hash ||
    !vk.FungibleTokenOfferContract.data ||
    !vk.FungibleTokenBidContract ||
    !vk.FungibleTokenBidContract.hash ||
    !vk.FungibleTokenBidContract.data ||
    !vk.FungibleTokenWhitelistedAdmin ||
    !vk.FungibleTokenWhitelistedAdmin.hash ||
    !vk.FungibleTokenWhitelistedAdmin.data ||
    !vk.FungibleTokenAdmin ||
    !vk.FungibleTokenAdmin.hash ||
    !vk.FungibleTokenAdmin.data ||
    !vk.WhitelistedFungibleToken ||
    !vk.WhitelistedFungibleToken.hash ||
    !vk.WhitelistedFungibleToken.data ||
    !vk.FungibleToken ||
    !vk.FungibleToken.hash ||
    !vk.FungibleToken.data
  )
    throw new Error("Cannot get verification key");

  const adminVerificationKey = isWhitelisted
    ? vk.FungibleTokenWhitelistedAdmin
    : vk.FungibleTokenAdmin;
  const tokenVerificationKey = isWhitelisted
    ? vk.WhitelistedFungibleToken
    : vk.FungibleToken;
  const offerVerificationKey = FungibleTokenOfferContract._verificationKey ?? {
    hash: Field(vk.FungibleTokenOfferContract.hash),
    data: vk.FungibleTokenOfferContract.data,
  };
  const bidVerificationKey = FungibleTokenBidContract._verificationKey ?? {
    hash: Field(vk.FungibleTokenBidContract.hash),
    data: vk.FungibleTokenBidContract.data,
  };

  console.log("Sender balance:", await accountBalanceMina(sender));
  console.log("New account:", isNewAccount);

  const tx = await Mina.transaction({ sender, fee, memo, nonce }, async () => {
    const feeAccountUpdate = AccountUpdate.createSigned(sender);
    if (isNewAccount) {
      feeAccountUpdate.balance.subInPlace(1_000_000_000);
    }
    feeAccountUpdate.send({
      to: provingKey,
      amount: provingFee,
    });
    if (developerAddress && developerFee) {
      feeAccountUpdate.send({
        to: developerAddress,
        amount: developerFee,
      });
    }
    switch (txType) {
      case "mint":
        if (amount === undefined) throw new Error("Error: Amount is required");
        await zkToken.mint(to, amount);
        break;

      case "transfer":
        if (amount === undefined) throw new Error("Error: Amount is required");
        await zkToken.transfer(from, to, amount);
        break;

      case "offer":
        if (price === undefined) throw new Error("Error: Price is required");
        if (amount === undefined) throw new Error("Error: Amount is required");
        if (isNewAccount) {
          await offerContractDeployment.deploy({
            verificationKey: offerVerificationKey,
            whitelist: whitelist ?? Whitelist.empty(),
          });
          offerContract.account.zkappUri.set(`Offer for ${symbol}`);
          await offerContract.initialize(sender, tokenAddress, amount, price);
          await zkToken.approveAccountUpdates([
            offerContractDeployment.self,
            offerContract.self,
          ]);
        } else {
          await offerContract.offer(amount, price);
          await zkToken.approveAccountUpdate(offerContract.self);
        }

        break;

      case "buy":
        if (amount === undefined) throw new Error("Error: Amount is required");
        await offerContract.buy(amount);
        await zkToken.approveAccountUpdate(offerContract.self);
        break;

      case "withdrawOffer":
        if (amount === undefined) throw new Error("Error: Amount is required");
        await offerContract.withdraw(amount);
        await zkToken.approveAccountUpdate(offerContract.self);
        break;

      case "bid":
        if (price === undefined) throw new Error("Error: Price is required");
        if (amount === undefined) throw new Error("Error: Amount is required");
        if (isNewAccount) {
          await bidContractDeployment.deploy({
            verificationKey: bidVerificationKey,
            whitelist: whitelist ?? Whitelist.empty(),
          });
          bidContract.account.zkappUri.set(`Bid for ${symbol}`);
          await bidContract.initialize(tokenAddress, amount, price);
          await zkToken.approveAccountUpdates([
            bidContractDeployment.self,
            bidContract.self,
          ]);
        } else {
          await bidContract.bid(amount, price);
          await zkToken.approveAccountUpdate(bidContract.self);
        }
        break;

      case "sell":
        if (amount === undefined) throw new Error("Error: Amount is required");
        await bidContract.sell(amount);
        await zkToken.approveAccountUpdate(bidContract.self);
        break;

      case "withdrawBid":
        if (amount === undefined) throw new Error("Error: Amount is required");
        await bidContract.withdraw(amount);
        await zkToken.approveAccountUpdate(bidContract.self);
        break;

      case "whitelistAdmin":
        if (!whitelist) throw new Error("Whitelist is required");
        await whitelistedAdminContract.updateWhitelist(whitelist);
        break;

      case "whitelistBid":
        if (!whitelist) throw new Error("Whitelist is required");
        await bidContract.updateWhitelist(whitelist);
        break;

      case "whitelistOffer":
        if (!whitelist) throw new Error("Whitelist is required");
        await offerContract.updateWhitelist(whitelist);
        await zkToken.approveAccountUpdate(offerContract.self);
        break;

      default:
        throw new Error(`Unknown transaction type: ${txType}`);
    }
  });
  return {
    tx,
    isWhitelisted,
    adminContractAddress,
    adminAddress,
    symbol,
    adminVerificationKey: {
      hash: Field(adminVerificationKey.hash),
      data: adminVerificationKey.data,
    },
    tokenVerificationKey: {
      hash: Field(tokenVerificationKey.hash),
      data: tokenVerificationKey.data,
    },
    offerVerificationKey,
    bidVerificationKey,
    whitelist: whitelist?.toString(),
  };
}

export async function getTokenSymbolAndAdmin(params: {
  tokenAddress: PublicKey;
  chain: blockchain;
}): Promise<{
  adminContractAddress: PublicKey;
  adminAddress: PublicKey;
  symbol: string;
  isWhitelisted: boolean;
}> {
  const { tokenAddress, chain } = params;
  const vk =
    tokenVerificationKeys[chain === "mainnet" ? "mainnet" : "testnet"].vk;
  class FungibleTokenState extends Struct({
    decimals: UInt8,
    admin: PublicKey,
    paused: Bool,
  }) {}
  const FungibleTokenStateSize = FungibleTokenState.sizeInFields();
  class FungibleTokenAdminState extends Struct({
    adminPublicKey: PublicKey,
  }) {}
  const FungibleTokenAdminStateSize = FungibleTokenAdminState.sizeInFields();

  await fetchMinaAccount({ publicKey: tokenAddress, force: true });
  if (!Mina.hasAccount(tokenAddress)) {
    throw new Error("Token contract account not found");
  }

  const account = Mina.getAccount(tokenAddress);
  const verificationKey = account.zkapp?.verificationKey;
  if (!verificationKey) {
    throw new Error("Token contract verification key not found");
  }
  if (
    verificationKey.hash.toJSON() !== vk.FungibleToken.hash ||
    verificationKey.data !== vk.FungibleToken.data ||
    verificationKey.hash.toJSON() !== vk.WhitelistedFungibleToken.hash ||
    verificationKey.data !== vk.WhitelistedFungibleToken.data
  ) {
    throw new Error("Unknown token verification key");
  }
  if (account.zkapp?.appState === undefined) {
    throw new Error("Token contract state not found");
  }

  const state = FungibleTokenState.fromFields(
    account.zkapp?.appState.slice(0, FungibleTokenStateSize)
  );
  const symbol = account.tokenSymbol;
  const adminContractPublicKey = state.admin;
  await fetchMinaAccount({
    publicKey: adminContractPublicKey,
    force: true,
  });
  if (!Mina.hasAccount(adminContractPublicKey)) {
    throw new Error("Admin contract account not found");
  }

  const adminContract = Mina.getAccount(adminContractPublicKey);
  const adminVerificationKey = adminContract.zkapp?.verificationKey;

  if (!adminVerificationKey) {
    throw new Error("Admin verification key not found");
  }
  let isWhitelisted = false;
  if (
    vk.FungibleTokenWhitelistedAdmin.hash ===
      adminVerificationKey.hash.toJSON() &&
    vk.FungibleTokenWhitelistedAdmin.data === adminVerificationKey.data
  ) {
    isWhitelisted = true;
  } else if (
    vk.FungibleTokenAdmin.hash === adminVerificationKey.hash.toJSON() &&
    vk.FungibleTokenAdmin.data === adminVerificationKey.data
  ) {
    isWhitelisted = false;
  } else {
    throw new Error("Unknown admin verification key");
  }
  const adminAddress0 = adminContract.zkapp?.appState[0];
  const adminAddress1 = adminContract.zkapp?.appState[1];
  if (adminAddress0 === undefined || adminAddress1 === undefined) {
    throw new Error("Cannot fetch admin address from admin contract");
  }
  const adminAddress = PublicKey.fromFields([adminAddress0, adminAddress1]);

  return {
    adminContractAddress: adminContractPublicKey,
    adminAddress: adminAddress,
    symbol,
    isWhitelisted,
  };
}
