import React, { useCallback, useState } from "react";
import { parseEther } from "viem";
import { useDebounce } from "use-debounce";
import { contractAddress, erc20ABI } from "../../../libs/contractABIs/erc20ABI";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { AlertMsg } from "../../AlertMsg";

// const Approve = ({ args }: { args: string[] }) => {
//   const [errMsg, setErrMsg] = useState<null | string>(null);
//   const [allowance, setAllowance] = useState<null | unknown>();

//   useEffect(() => {
//     setAllowance(`${data}`);
//   }, [data]);

//   useEffect(() => {
//     if (error) setErrMsg(`${error.message}`);
//   }, [error]);

//   //console.log("allowance", data, error, isLoading);

//   return (
//     <div className="my-2">
//       {allowance && <p>The allowance is: {allowance}</p>}
//       {!allowance && errMsg && <p className="text-sm text-red-500">{errMsg}</p>}
//     </div>
//   );
// };

let count = 0;
export default function ApproveTransactionForm() {
  //   const [args, setArgs] = useState<undefined | string[]>(undefined);
  const [formValues, setFormValues] = useState({
    amount: "",
    spender: "",
  });
  const [debouncedAmt] = useDebounce(formValues.amount, 500);
  const [debouncedSpender] = useDebounce(formValues.spender, 500);

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    abi: erc20ABI,
    address: contractAddress,
    functionName: "approve",
    args: [
      debouncedSpender,
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
      name: "amount" | "spender"
    ) => {
      const value = event.target.value;
      setFormValues((prev) => ({ ...prev, [name]: value }));
      count++;
    },
    []
  );

  console.log("approve", data, prepareError?.message, error?.message);
  //   console.count("rendered");

  return (
    <div className="my-5 border p-4">
      <form className="space-y-3">
        <h3 className="mb-2 text-xl font-medium underline">
          Approve transaction
        </h3>
        <label>
          spender (address) <br />
          <input
            type="text"
            className="block border px-4 py-2 w-full mt-1"
            value={formValues.spender}
            onChange={(e) => onChange(e, "spender")}
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
              if (formValues.amount === "" || formValues.spender === "") return;
              write();
            }}
            type="button"
            className="primary_btn"
          >
            {writeLoading || waitForTxLoading ? "Approving..." : "Approve"}
          </button>
          {isSuccess && (
            <AlertMsg type="success">
              <p>You have successfully approved transaction!</p>
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
          {(isPrepareError || isError) && count > 0 && (
            <AlertMsg type="error">
              <p>Error: {(prepareError || error)?.message}</p>
            </AlertMsg>
          )}
        </div>
      </form>
    </div>
  );
}
