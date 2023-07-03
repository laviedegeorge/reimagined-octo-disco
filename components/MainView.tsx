import React, { useEffect, useState } from "react";
import { useAccount, useContractReads } from "wagmi";
import { contractAddress, erc20ABI } from "../libs/contractABIs/erc20ABI";
import ReadAllowance from "./contractComponents/contractForms/ReadAllowance";
import Web3 from "web3";

const tokenContract = {
  address: contractAddress,
  abi: erc20ABI,
};

const tokenInfoNames = [
  "tokenName",
  "balance",
  "decimals",
  "tokenSymbol",
  "totalSupply",
];

type ContractInfo = {
  tokenName: unknown;
  balance: unknown;
  decimals: unknown;
  tokenSymbol: unknown;
  totalSupply: unknown;
};

export default function MainView() {
  const { address } = useAccount();
  const [tokenContractInfo, setTokenContractInfo] = useState<ContractInfo>();
  const { tokenName, balance, decimals, tokenSymbol, totalSupply } =
    tokenContractInfo || {};
  const { data: tokenContractData, isLoading: isLoadingTokenContractData } =
    useContractReads({
      contracts: [
        {
          ...tokenContract,
          functionName: "name",
        },
        {
          ...tokenContract,
          functionName: "balanceOf",
          args: [address],
        },
        {
          ...tokenContract,
          functionName: "decimals",
        },
        {
          ...tokenContract,
          functionName: "symbol",
        },
        {
          ...tokenContract,
          functionName: "totalSupply",
        },
      ],
    });

  useEffect(() => {
    if (tokenContractData) {
      let tokenInfoObj = {} as ContractInfo;
      tokenContractData?.map((data, idx) => {
        tokenInfoObj[tokenInfoNames[idx]] = data.result;
        return null;
      });
      setTokenContractInfo(tokenInfoObj);
    }
  }, [tokenContractData]);

  //   console.log("contract info", tokenContractInfo);

  isLoadingTokenContractData && <p>Loading name of token...</p>;

  return (
    <div>
      <div className="my-4">
        <h2 className="text-2xl font-semibold underline mb-2">Read contract</h2>
        <p>Name of token: {`${tokenName && tokenName}`.toLocaleUpperCase()}</p>
        <p>
          Token symbol: {`${tokenSymbol && tokenSymbol}`.toLocaleUpperCase()}
        </p>
        <p>
          Balance:{" "}
          {`${
            balance && Web3.utils.fromWei(`${balance}`, "ether")
          }${tokenSymbol}`}
        </p>
        <p>
          Total supply:{" "}
          {`${
            totalSupply && Web3.utils.fromWei(`${totalSupply}`, "ether")
          }${tokenSymbol}`}
        </p>
        <p>decimals: {`${decimals && decimals}`}</p>
        <ReadAllowance />
      </div>
      {/* <BalanceOfBtn /> */}
    </div>
  );
}
