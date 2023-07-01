import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Head from "next/head";
import classNames from "classnames";
import { erc20ABI } from "../libs/contractABIs/erc20ABI";
import { MetaMaskInpageProvider } from "@metamask/providers";
import detectEthereumProvider from "@metamask/detect-provider";

const erc20ContractAddress = "0x56a7Ee2292fA2483c8763fc093aBF6eBe64E13BB";

/** eslint-ignore react/react-in-jsx-scope */
export default function Home() {
  const contractAddress = erc20ContractAddress;
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<null | string>(null);
  const [contractInfo, setContractInfo] = useState({
    tokenName: null,
    tokenSymbol: null,
    totalSupply: null,
  });
  const [contractInstance, setContractInstance] = useState<null | any>(null);

  useEffect(() => {
    const getProvider = async () => {
      try {
        setLoading(true);
        const provider: MetaMaskInpageProvider = await detectEthereumProvider();
        const accounts: string[] = await provider.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);

        const web3 = new Web3(provider);
        const contractInstance = new web3.eth.Contract(
          erc20ABI,
          contractAddress
        );
        setContractInstance(contractInstance);

        const tokenName = await contractInstance?.methods?.name().call();
        const totalSupply = await contractInstance?.methods
          ?.totalSupply()
          .call();
        const tokenSymbol = await contractInstance?.methods?.symbol().call();
        setContractInfo({ tokenName, tokenSymbol, totalSupply });

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };

    getProvider();
  }, [contractAddress]);

  return (
    <div className="">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className=" min-w-full min-h-screen flex justify-center items-center relative">
        <>
          <div className="flex bg-slate-300 py-1 px-2 absolute top-0">
            <div className="flex  items-center space-x-2">
              <div
                className={classNames("rounded-full w-4 h-4", {
                  "bg-green-400": Boolean(account),
                  "bg-red-500": Boolean(!account),
                })}
              ></div>
              <p className="text-sm">
                {account ? "Connected" : "Disconnected"}
              </p>
            </div>
            <div className="w-[2px] bg-white mx-4"></div>
            <p className="text-sm">{`${shortenAddress(account)}...`}</p>
          </div>
          <div>
            {loading && <p>Loading ...</p>}
            {!loading && account && contractInstance && (
              <div>
                <div>
                  <p>
                    <span className=" font-bold">TOKEN NAME:</span>{" "}
                    {contractInfo?.tokenName}
                  </p>
                  <p>
                    <span className=" font-bold">TOKEN SYMBOL:</span>{" "}
                    {contractInfo?.tokenSymbol}
                  </p>
                  <p>
                    <span className=" font-bold">TOTAL SUPPLY:</span>{" "}
                    {`${contractInfo?.totalSupply} ${contractInfo?.tokenSymbol}`}
                  </p>
                </div>
                <div className=" space-x-2">
                  <button
                    className="primary_btn"
                    onClick={() =>
                      getBalance(contractInstance, account, setLoading)
                    }
                  >
                    {loading ? "Loading..." : "Get balance"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      </main>

      <footer></footer>
    </div>
  );
}

const shortenAddress = (address) => {
  try {
    const addressArr = (address || "").split("");
    const shortAddress = addressArr.splice(0, 6).join("");
    return shortAddress;
  } catch (error) {
    console.log(error);
    return "";
  }
};

const getBalance = async (
  contractInstance: any,
  account: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setLoading(true);
    const res = await contractInstance?.methods?.balanceOf(account).call();
    alert(`Your balance is ${res} tBNB`);
    setLoading(false);
  } catch (error) {
    console.error(error);
    setLoading(false);
  }
};
