import React, { EventHandler, useCallback, useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import { contractAddress, erc20ABI } from "../../../libs/contractABIs/erc20ABI";

const Allowance = ({ args }: { args: string[] }) => {
  const [errMsg, setErrMsg] = useState<null | string>(null);
  const [allowance, setAllowance] = useState<null | unknown>();

  const { data, isLoading, error } = useContractRead({
    address: contractAddress,
    abi: erc20ABI,
    functionName: "allowance",
    args /* : [
          "0xe58cbb0866d41623edacd39243c2b01b514f4b29",
          "0x37ed686349ccf9627c01527f5c0cc27c1ff9058c",
        ] */,
  });

  useEffect(() => {
    setAllowance(`${data}`);
  }, [data]);

  useEffect(() => {
    if (error) setErrMsg(`${error.message}`);
  }, [error]);

  //console.log("allowance", data, error, isLoading);

  return (
    <div className="my-2">
      {allowance && <p>The allowance is: {allowance}</p>}
      {!allowance && errMsg && <p className="text-sm text-red-500">{errMsg}</p>}
    </div>
  );
};

export default function ReadAllowance() {
  const [args, setArgs] = useState<undefined | string[]>(undefined);
  const [formValues, setFormValues] = useState({
    owner: "",
    spender: "",
  });

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, name: "owner" | "spender") => {
      const value = event.target.value;
      setFormValues((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  //   console.log("allowance", data);

  return (
    <div className="my-5 border p-4">
      <form className="space-y-3">
        <h3 className="mb-2 text-xl font-medium underline">Check allowance</h3>
        <label>
          Owner address <br />
          <input
            type="text"
            className="block border px-4 py-2 w-full mt-1"
            value={formValues.owner}
            onChange={(e) => onChange(e, "owner")}
            placeholder="0xE58...4B29"
          />
        </label>
        <label>
          spender address <br />
          <input
            type="text"
            className="block border px-4 py-2 w-full mt-1"
            value={formValues.spender}
            onChange={(e) => onChange(e, "spender")}
            placeholder="0xE58...4B29"
          />
        </label>
        <div>
          {args && <Allowance args={args} />}
          <button
            onClick={() => {
              if (formValues.owner === "" || formValues.spender === "") return;
              setArgs([formValues.owner, formValues.spender]);
            }}
            type="button"
            className="primary_btn"
          >
            {/* {isLoading ? "Loading..." : "Check allowance"} */}
            Check allowance
          </button>
        </div>
      </form>
    </div>
  );
}
