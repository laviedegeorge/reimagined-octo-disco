import React, { useCallback, useState } from "react";
import { parseEther } from "viem";
import { AlertMsg } from "../../AlertMsg";
import { useDebounce } from "use-debounce";
import { contractAddress, erc20ABI } from "../../../libs/contractABIs/erc20ABI";
import {
  useContractWrite,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";

let transferToCount = 0;
let transferFromToCount = 0;

export default function TransferTo() {
  //   const [args, setArgs] = useState<undefined | string[]>(undefined);
  const [formValues, setFormValues] = useState({
    to: "",
    amount: "",
  });
  const [debouncedAmt] = useDebounce(formValues.amount, 500);
  const [debouncedTo] = useDebounce(formValues.to, 500);

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    abi: erc20ABI,
    address: contractAddress,
    functionName: "transfer",
    args: [debouncedTo, debouncedAmt ? parseEther(debouncedAmt) : undefined],
  });

  const {
    write,
    data,
    error,
    isError,
    isLoading: writeLoading,
  } = useContractWrite(config);
  const { isLoading: waitForTxLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const onChange = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      name: "from" | "to" | "amount"
    ) => {
      const value = event.target.value;
      setFormValues((prev) => ({ ...prev, [name]: value }));
      transferToCount++;
    },
    []
  );

  return (
    <form className="space-y-3">
      <label>
        To (address) <br />
        <input
          type="text"
          className="block border px-4 py-2 w-full mt-1"
          value={formValues.to}
          onChange={(e) => onChange(e, "to")}
          placeholder="0xE58...4B29"
        />
      </label>
      <label>
        Amount <br />
        <input
          type="text"
          className="block border px-4 py-2 w-full mt-1"
          value={formValues.amount}
          onChange={(e) => onChange(e, "amount")}
          placeholder="0.05"
        />
      </label>
      <div>
        <button
          disabled={!write}
          onClick={() => {
            if (formValues.amount === "" || formValues.to === "") return;
            write();
          }}
          type="button"
          className="primary_btn"
        >
          {writeLoading || waitForTxLoading ? "Transferring..." : "Transfer"}
        </button>
        {isSuccess && (
          <AlertMsg type="success">
            <p>Transfer successful!</p>
            <a
              className=" underline"
              href={`https://testnet.bscscan.com/tx/${data?.hash}`}
              target="_blank"
              rel="noreferrer"
            >
              See transaction here (BscScan testnet)
            </a>
          </AlertMsg>
        )}
        {(isPrepareError || isError) && transferToCount > 0 && (
          <AlertMsg type="error">
            <p>Error: {(prepareError || error)?.message}</p>
          </AlertMsg>
        )}
      </div>
    </form>
  );
}

export function TransferFromTo() {
  const [formValues, setFormValues] = useState({
    from: "",
    to: "",
    amount: "",
  });
  const [debouncedAmt] = useDebounce(formValues.amount, 500);
  const [debouncedFrom] = useDebounce(formValues.from, 500);
  const [debouncedTo] = useDebounce(formValues.to, 500);

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    abi: erc20ABI,
    address: contractAddress,
    functionName: "transferFrom",
    args: [
      debouncedFrom,
      debouncedTo,
      debouncedAmt ? parseEther(debouncedAmt) : undefined,
    ],
  });

  const {
    write,
    data,
    error,
    isError,
    isLoading: writeLoading,
  } = useContractWrite(config);
  const { isLoading: waitForTxLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const onChange = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      name: "from" | "to" | "amount"
    ) => {
      const value = event.target.value;
      setFormValues((prev) => ({ ...prev, [name]: value }));
      transferFromToCount++;
    },
    []
  );

  return (
    <form className="space-y-3">
      <label>
        From (address) <br />
        <input
          type="text"
          className="block border px-4 py-2 w-full mt-1"
          value={formValues.from}
          onChange={(e) => onChange(e, "from")}
          placeholder="0xE58...4B29"
        />
      </label>
      <label>
        To (address) <br />
        <input
          type="text"
          className="block border px-4 py-2 w-full mt-1"
          value={formValues.to}
          onChange={(e) => onChange(e, "to")}
          placeholder="0xE58...4B29"
        />
      </label>
      <label>
        Amount <br />
        <input
          type="text"
          className="block border px-4 py-2 w-full mt-1"
          value={formValues.amount}
          onChange={(e) => onChange(e, "amount")}
          placeholder="0.05"
        />
      </label>
      <div>
        <button
          disabled={!write}
          onClick={() => {
            if (
              formValues.amount === "" ||
              formValues.from === "" ||
              formValues.to === ""
            )
              return;
            write();
          }}
          type="button"
          className="primary_btn"
        >
          {writeLoading || waitForTxLoading ? "Transferring..." : "Transfer"}
        </button>
        {isSuccess && (
          <AlertMsg type="success">
            <p>Transfer successful!</p>
            <a
              className=" underline"
              href={`https://testnet.bscscan.com/tx/${data?.hash}`}
              target="_blank"
              rel="noreferrer"
            >
              See transaction here (BscScan testnet)
            </a>
          </AlertMsg>
        )}
        {(isPrepareError || isError) && transferFromToCount > 0 && (
          <AlertMsg type="error">
            <p>Error: {(prepareError || error)?.message}</p>
          </AlertMsg>
        )}
      </div>
    </form>
  );
}

export function TransferNativeTo() {
  const [formValues, setFormValues] = useState({
    to: "",
    amount: "",
  });
  const [debouncedAmt] = useDebounce(formValues.amount, 500);
  const [debouncedTo] = useDebounce(formValues.to, 500);

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareSendTransaction({
    to: debouncedTo,
    value: debouncedAmt ? parseEther(debouncedAmt) : undefined,
  });

  const {
    sendTransaction,
    data,
    error,
    isError,
    isLoading: writeLoading,
  } = useSendTransaction(config);
  const { isLoading: waitForTxLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const onChange = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      name: "from" | "to" | "amount"
    ) => {
      const value = event.target.value;
      setFormValues((prev) => ({ ...prev, [name]: value }));
      transferToCount++;
    },
    []
  );

  return (
    <form className="space-y-3">
      <label>
        To (address) <br />
        <input
          type="text"
          className="block border px-4 py-2 w-full mt-1"
          value={formValues.to}
          onChange={(e) => onChange(e, "to")}
          placeholder="0xE58...4B29"
        />
      </label>
      <label>
        Amount <br />
        <input
          type="text"
          className="block border px-4 py-2 w-full mt-1"
          value={formValues.amount}
          onChange={(e) => onChange(e, "amount")}
          placeholder="0.05"
        />
      </label>
      <div>
        <button
          disabled={!sendTransaction}
          onClick={() => {
            if (formValues.amount === "" || formValues.to === "") return;
            sendTransaction();
          }}
          type="button"
          className="primary_btn"
        >
          {writeLoading || waitForTxLoading ? "Transferring..." : "Transfer"}
        </button>
        {isSuccess && (
          <AlertMsg type="success">
            <p>Transfer successful!</p>
            <a
              className=" underline"
              href={`https://testnet.bscscan.com/tx/${data?.hash}`}
              target="_blank"
              rel="noreferrer"
            >
              See transaction here (BscScan testnet)
            </a>
          </AlertMsg>
        )}
        {(isPrepareError || isError) && transferToCount > 0 && (
          <AlertMsg type="error">
            <p>Error: {(prepareError || error)?.message}</p>
          </AlertMsg>
        )}
      </div>
    </form>
  );
}
