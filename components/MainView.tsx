import React, { useCallback, useEffect, useState } from "react";
import { useAccount, useContractReads } from "wagmi";
import { contractAddress, erc20ABI } from "../libs/contractABIs/erc20ABI";
import ReadAllowance from "./contractComponents/contractForms/ReadAllowance";
import Web3 from "web3";
import ApproveTransactionForm from "./contractComponents/contractForms/ApproveForm";
import DecreaseIncreaseAllowanceForm from "./contractComponents/contractForms/DecreaseIncreaseAllowance";
import TransferTo, {
  TransferFromTo,
  TransferNativeTo,
} from "./contractComponents/contractForms/TransferForms";
import FormContainer from "./FormContainer";

const tokenContract: any = {
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

type IsOpenTypes =
  | "read_allowance"
  | "approve"
  | "decrease_allowance"
  | "increase_allowance"
  | "transfer"
  | "transfer_to"
  | "transfer_TBNB_to"
  | "";

export default function MainView() {
  const { address } = useAccount();
  const [open, setOpen] = useState<IsOpenTypes>();
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

  const changeOpen = useCallback((nextState: IsOpenTypes) => {
    setOpen((prev) => {
      if (prev === nextState) {
        return "";
      } else {
        return nextState;
      }
    });
  }, []);

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

  isLoadingTokenContractData && <p>Loading name of token...</p>;

  return (
    <div>
      <div className="my-4">
        <h2 className="text-2xl font-semibold underline mb-2">Read methods</h2>
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
        <div className="my-5">
          <FormContainer
            header="Read allowance"
            isOpen={open === "read_allowance"}
            setIsOpen={() => changeOpen("read_allowance")}
          >
            <ReadAllowance />
          </FormContainer>
        </div>
      </div>
      <div className=" space-y-5">
        <h2 className="text-2xl font-semibold underline mb-2">Read methods</h2>
        <FormContainer
          header="Approve transaction"
          isOpen={open === "approve"}
          setIsOpen={() => changeOpen("approve")}
        >
          <ApproveTransactionForm />
        </FormContainer>

        <FormContainer
          header="Decrease allowance"
          isOpen={open === "decrease_allowance"}
          setIsOpen={() => changeOpen("decrease_allowance")}
        >
          <DecreaseIncreaseAllowanceForm type="decreaseAllowance" />
        </FormContainer>

        <FormContainer
          header="Increase allowance"
          isOpen={open === "increase_allowance"}
          setIsOpen={() => changeOpen("increase_allowance")}
        >
          <DecreaseIncreaseAllowanceForm type="increaseAllowance" />
        </FormContainer>

        <FormContainer
          header="Transfer to"
          isOpen={open === "transfer"}
          setIsOpen={() => changeOpen("transfer")}
        >
          <TransferTo />
        </FormContainer>

        <FormContainer
          header="Transfer from"
          isOpen={open === "transfer_to"}
          setIsOpen={() => changeOpen("transfer_to")}
        >
          <TransferFromTo />
        </FormContainer>

        <FormContainer
          header="Transfer TBNB"
          isOpen={open === "transfer_TBNB_to"}
          setIsOpen={() => changeOpen("transfer_TBNB_to")}
        >
          <TransferNativeTo />
        </FormContainer>
      </div>
    </div>
  );
}
